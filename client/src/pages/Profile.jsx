import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { BookmarkCheck, Award, History, ChevronRight, User, Mail, Calendar } from "lucide-react";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [bookmarkedCareers, setBookmarkedCareers] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const bookmarkResponse = await fetch('http://localhost:3000/bookmark/get-bookmarks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.email }),
          });
          
          if (!bookmarkResponse.ok) {
            throw new Error('Failed to fetch bookmarks');
          }
          
          const bookmarkData = await bookmarkResponse.json();
          setBookmarkedCareers(bookmarkData.bookmarks || []);

          const testHistoryResponse = await fetch('http://localhost:3000/api/users/test-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.email }),
          });

          if (!testHistoryResponse.ok) {
            throw new Error('Failed to fetch test history');
          }

          const historyData = await testHistoryResponse.json();
          setTestHistory(historyData.history || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
          <Link
            to="/auth"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-blue-500" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full shadow"></div>
            </div>
            
            <div className="flex-1">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.displayName || "Anonymous User"}
                </h1>
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    Joined {new Date(user.metadata.creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <History className="w-4 h-4 mr-2" />
                  {testHistory.length} Tests Completed
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                  {bookmarkedCareers.length} Careers Bookmarked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Bookmarked Careers Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookmarkCheck className="w-6 h-6 mr-3 text-blue-500" />
              Bookmarked Careers
            </h2>
            <Link
              to="/explore"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {bookmarkedCareers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedCareers.map((career) => (
                <Link
                  key={career._id}
                  to={`/career-details/${career.name}`}
                  className="block p-6 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{career.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{career.category}</p>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-sm text-blue-600">View Details</span>
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No bookmarked careers yet</p>
              <Link
                to="/explore"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Careers
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>

        {/* Full-width Recent Tests Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="w-6 h-6 mr-3 text-blue-500" />
              Recent Tests
            </h2>
          </div>

          {testHistory.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testHistory.map((test, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-gray-100 hover:border-green-100 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Completed on {new Date(test.date).toLocaleDateString()}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Score: {test.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tests taken yet</p>
              <Link
                to="/test"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Personality Test
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;