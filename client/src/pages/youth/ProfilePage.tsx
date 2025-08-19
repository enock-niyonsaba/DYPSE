import React, { useState } from 'react';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, 
  MapPinIcon, DocumentTextIcon, PencilIcon,
  BriefcaseIcon, AcademicCapIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import CircularProgress from '../../components/CircularProgress';
import ProfileCard from '../../components/ProfileCard';
import InfoItem from '../../components/InfoItem';
import PersonalInfoModal  from '../../components/modals/PersonalInfoModal';
import LocationModal from '../../components/modals/LocationModal';
import SkillsModal from '../../components/modals/SkillsModal';
import ExperienceModal from '../../components/modals/ExperienceModal';
import EducationModal from '../../components/modals/EducationModal';

// Types
interface Experience {
  id?: string;
  employerName: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: LocationData;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  cvUrl?: string;
  profilePicture?: string;
};

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
};

interface LocationData{
  address: string;
  city: string;
  country: string;
  postalCode: string;
  region: string;
};


const calculateProfileCompletion = (user: UserProfile): number => {
  const totalFields = 9; // Total number of fields we're checking
  let completedFields = 0;

  // Basic info
  if (user.firstName && user.lastName) completedFields++;
  if (user.email) completedFields++;
  if (user.phone) completedFields++;
  
  // Location
  if (user.location && Object.values(user.location).some(Boolean)) completedFields++;
  
  // Bio
  if (user.bio) completedFields++;
  
  // Skills
  if (user.skills && user.skills.length > 0) completedFields++;
  
  // Experience
  if (user.experience && user.experience.length > 0) completedFields++;
  
  // Education
  if (user.education && user.education.length > 0) completedFields++;
  
  // Profile picture
  if (user.profilePicture) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

const ProfilePage = () => {
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  // Mock user data - replace with your actual data
  const [user, setUser] = useState<UserProfile>({
    firstName: 'Evode',
    lastName: 'SANO',
    email: 'evodesano@gmail.com',
    phone: '+250 729 525 550',
    location: {
      address: 'KN 4 Ave',
      city: 'Kigali',
      country: 'Rwanda',
      postalCode: '0000',
      region: 'Gasabo'
    },
    bio: 'Software Engineer with 3+ years of experience in web development',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: [
      { 
        id: '1',
        employerName: 'Tech Corp',
        role: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        isCurrent: false,
        description: 'Worked on multiple projects'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science',
        institution: 'University of Technology',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-06-01',
        description: 'Graduated with honors'
      },
      { 
        id: '2',
        degree: 'Master of Science',
        institution: 'MIT',
        fieldOfStudy: 'Computer Science',
        startDate: '2020-09-01',
        endDate: '2022-06-01',
        description: 'Graduated with honors'
      }
    ]
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalInfo = (data: PersonalInfo) => {
    setUser(prev => ({
      ...prev,
      ...data
    }));
    setIsPersonalInfoModalOpen(false);
  };

  const handleSaveLocation = (locationData: LocationData) => {
    setUser(prev => ({
      ...prev,
      location: locationData
    }));
    setIsLocationModalOpen(false);
  };

  const handleSaveSkills = (skills: string[]) => {
    setUser(prev => ({ ...prev, skills }));
    setIsSkillsModalOpen(false);
  };

  const handleSaveExperience = (experience: Experience) => {
    setUser(prev => {
      // If experience has an ID, update existing, otherwise add as new
      if (experience.id) {
        return {
          ...prev,
          experience: prev.experience.map(exp => 
            exp.id === experience.id ? experience : exp
          )
        };
      } else {
        // Add new experience with a new ID
        return {
          ...prev,
          experience: [
            ...prev.experience,
            { ...experience, id: Date.now().toString() }
          ]
        };
      }
    });
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = (educationData: Omit<Education, 'id'>) => {
    if (editingEducation) {
      setUser(prev => ({
        ...prev,
        education: prev.education.map(edu => 
          edu.id === editingEducation.id ? { ...educationData, id: editingEducation.id } : edu
        ),
      }));
    } else {
      setUser(prev => ({
        ...prev,
        education: [
          ...prev.education,
          {
            ...educationData,
            id: Date.now().toString(),
          },
        ],
      }));
    }
    setIsEducationModalOpen(false);
  };

  const handleDeleteEducation = (id: string) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const [cvFileName, setCvFileName] = useState<string>('');

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCvFileName(file.name);
      setUser(prev => ({ ...prev, cvUrl: fileUrl }));
    }
  };

  const handleViewCV = () => {
    if (user.cvUrl) {
      window.open(user.cvUrl, '_blank');
    }
  };

  const handleDownloadCV = () => {
    if (user.cvUrl) {
      const link = document.createElement('a');
      link.href = user.cvUrl;
      link.download = cvFileName || 'my-cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const profileCompletion = calculateProfileCompletion(user);

  return (
    <div>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute  right-9">
        <div className="relative">
          <CircularProgress 
            percentage={profileCompletion} 
            size={80}
            progressColor="#4F46E5"
            textColor="#4F56E5"
            showText={true}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600">
            
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>
        
        {/* Personal Information Card */}
        <ProfileCard 
          title="Personal Information" 
          onEdit={() => setIsPersonalInfoModalOpen(true)}
          className="mb-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative group">
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <label 
                  className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  htmlFor="profile-picture-upload"
                >
                  <PencilIcon className="h-6 w-6 text-white" />
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <h3 className="mt-2 text-lg font-medium">{user.firstName} {user.lastName}</h3>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <InfoItem icon={EnvelopeIcon} label="Email" value={user.email} />
            <InfoItem icon={PhoneIcon} label="Phone" value={user.phone} />
            {user.bio && <p className="text-sm text-gray-600 mt-2">{user.bio}</p>}
          </div>
        </ProfileCard>

        {/* Location Card */}
        <ProfileCard 
          title="Location Details" 
          onEdit={() => setIsLocationModalOpen(true)}
          className="mb-6"
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium">{user.location.address}</p>
                <p className="text-sm text-gray-600">{user.location.city}, {user.location.region}</p>
                <p className="text-sm text-gray-600">{user.location.country} - {user.location.postalCode}</p>
              </div>
            </div>
          </div>
        </ProfileCard>

        {/* Skills Card */}
        <ProfileCard 
          title={
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Skills
            </div>
          }
          onEdit={() => setIsSkillsModalOpen(true)}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        </ProfileCard>

        {/* Experience Card */}
        <ProfileCard 
          title="Experience" 
          onEdit={() => {
            setEditingExperience({
              id: '',
              employerName: '',
              role: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              description: ''
            });
            setIsExperienceModalOpen(true);
          }}
          className="mb-6"
        >
          {user.experience.map((exp, _index) => (
            <div key={exp.id} className="mb-4">
              <h4 className="font-medium">{exp.role}</h4>
              <p className="text-sm text-gray-600">{exp.employerName}</p>
              <p className="text-xs text-gray-500">
                {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
              </p>
              {exp.description && <p className="mt-1 text-sm text-gray-700">{exp.description}</p>}
            </div>
          ))}
        </ProfileCard>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Education
            </h2>
            <button 
              onClick={handleAddEducation}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Add education"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {user.education.length > 0 ? (
            <div className="space-y-4">
              {user.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </p>
                      {edu.description && <p className="mt-1 text-sm text-gray-700">{edu.description}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditEducation(edu)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit education"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteEducation(edu.id!)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete education"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education added yet. Click the + button to add your education.</p>
          )}
        </div>
      </div>
      
      {/* CV Upload */}
      <ProfileCard 
        title="CV / Resume" 
        className="mb-6"
        onEdit={() => {}} // Required prop
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2 justify-center">
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  {user.cvUrl ? 'Update CV' : 'Upload CV'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleCVUpload}
                  />
                </label>
                {user.cvUrl && (
                  <>
                    <button 
                      onClick={handleViewCV}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      onClick={handleDownloadCV}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </>
                )}
              </div>
              {user.cvUrl && (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                  <span>CV Uploaded: {cvFileName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProfileCard>
    </div>

    {/* Personal Info Modal */}
    {isPersonalInfoModalOpen && (
      <PersonalInfoModal
        isOpen={isPersonalInfoModalOpen}
        onClose={() => setIsPersonalInfoModalOpen(false)}
        onSave={handleSavePersonalInfo}
        info={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          bio: user.bio
        }}
        isSaving={false}
      />
    )}

    {/* Location Modal */}
    {isLocationModalOpen && (
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleSaveLocation}
        location={user.location}
        isSaving={false}
      />
    )}

    {/* Skills Modal */}
    {isSkillsModalOpen && (
      <SkillsModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          onSave={handleSaveSkills}
          skills={user.skills} isSaving={false}      />
    )}

    {/* Experience Modal */}
    {isExperienceModalOpen && (
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        experience={editingExperience}
        isSaving={false}
      />
    )}

    {/* Education Modal */}
    <EducationModal
      isOpen={isEducationModalOpen}
      onClose={() => setIsEducationModalOpen(false)}
      onSave={handleSaveEducation}
      initialData={editingEducation || undefined}
    />
  </div>
);
};
export default ProfilePage;
