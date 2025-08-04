import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Bookmark } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicants: number;
  saved?: boolean;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      // TODO: API call to get jobs
      // Mock data for now
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          type: 'full-time',
          salary: '$120,000 - $160,000',
          description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
          requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
          postedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          applicants: 23
        },
        {
          id: '2',
          title: 'Product Manager',
          company: 'StartupXYZ',
          location: 'Remote',
          type: 'remote',
          salary: '$100,000 - $140,000',
          description: 'Join our product team to drive innovation and deliver exceptional products to our customers.',
          requirements: ['3+ years PM experience', 'Agile methodology', 'Data-driven mindset'],
          postedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          applicants: 45
        },
        {
          id: '3',
          title: 'UI/UX Designer',
          company: 'Design Studio',
          location: 'New York, NY',
          type: 'full-time',
          salary: '$80,000 - $110,000',
          description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
          requirements: ['Figma expertise', 'Portfolio required', 'User research experience'],
          postedDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          applicants: 67
        }
      ];
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const applyToJob = (_jobId: string) => {
    // TODO: Implement job application
    alert('Application submitted! (This is a demo)');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'remote': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === '' || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === '' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs</h1>
        <p className="text-gray-600">Find your next opportunity</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobs
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job title or company"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="City, state, or remote"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setTypeFilter('');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {job.title}
                    </h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                      {job.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{formatDate(job.postedDate)}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center space-x-1">
                        <DollarSign size={16} />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users size={16} />
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-full transition-colors ${
                      job.saved
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark size={20} className={job.saved ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => applyToJob(job.id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
