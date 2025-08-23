import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { supabase, TABLES, USER_ROLES } from '../config/supabase';
import { generateToken } from '../config/jwt';
import UserDocument from '../models/UserDocument';
import { uploadFile } from '../services/fileUploadService';

// Registration interface
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rwandaId: string;
  phone: string;
  role: string;
}

// Login interface
interface LoginRequest {
  email: string;
  password: string;
}

// Registration endpoint
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, rwandaId, phone, role }: RegisterRequest = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !rwandaId || !phone || !role) {
      res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
      return;
    }

    // Validate role
    if (!Object.values(USER_ROLES).includes(role as any)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
      return;
    }

    // Check if email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('email', email)
      .single();

    if (emailError && emailError.code !== 'PGRST116') {
      res.status(500).json({
        success: false,
        message: 'Database error checking email'
      });
      return;
    }

    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    // Check if Rwanda ID already exists
    const { data: existingRwandaId, error: rwandaIdError } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('rwanda_id', rwandaId)
      .single();

    if (rwandaIdError && rwandaIdError.code !== 'PGRST116') {
      res.status(500).json({
        success: false,
        message: 'Database error checking Rwanda ID'
      });
      return;
    }

    if (existingRwandaId) {
      res.status(409).json({
        success: false,
        message: 'Rwanda ID already registered'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from(TABLES.USERS)
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        rwanda_id: rwandaId,
        phone: phone,
        role: role,
        is_verified: false,
        created_at: new Date().toISOString()
      })
      .select('id, email, role, rwanda_id')
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
      return;
    }

    // Handle file uploads if any
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        const uploadPromises = Object.entries(req.files).map(async ([fieldName, file]: [string, any]) => {
          const documentType = fieldName as 'cv' | 'certificate' | 'business_evidence' | 'startup_proof';
          
          // Upload file to MongoDB
          const uploadedFile = await uploadFile(file, documentType, newUser.id, rwandaId);
          
          // Save document metadata to MongoDB
          await UserDocument.create({
            userId: newUser.id,
            rwandaId: rwandaId,
            documentType: documentType,
            fileName: uploadedFile.fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            filePath: uploadedFile.filePath,
            metadata: {
              description: `Uploaded ${documentType} for ${firstName} ${lastName}`,
              category: documentType
            }
          });
        });

        await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        // Continue with user creation even if file upload fails
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
      rwandaId: newUser.rwanda_id
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName,
        lastName
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// Login endpoint
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('id, email, password_hash, role, rwanda_id, first_name, last_name, is_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      rwandaId: user.rwanda_id
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        isVerified: user.is_verified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Logout endpoint
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('auth_token');
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Get user data from Supabase
    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('id, email, role, rwanda_id, first_name, last_name, phone, is_verified, created_at')
      .eq('id', req.user.userId)
      .single();

    if (userError || !user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get user documents from MongoDB
    const documents = await UserDocument.find({ userId: req.user.userId })
      .select('documentType fileName originalName uploadDate isVerified')
      .sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          rwandaId: user.rwanda_id,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          isVerified: user.is_verified,
          createdAt: user.created_at
        },
        documents
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile'
    });
  }
};
