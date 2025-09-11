import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Page imports
import FeedPage from '@/pages/Feed';
import ProfilePage from '@/pages/Profile';
import EditProfilePage from '@/pages/EditProfilePage';
import MessagesPage from '@/pages/Messages';
import MessagePreviewPage from '@/pages/MessagePreview';
import ComposeMessagePage from '@/pages/ComposeMessage';
import SearchPage from '@/pages/Search';
import UsersPage from '@/pages/Users';
import LivePage from '@/pages/Live';
import LiveStreamModerationPage from '@/pages/LiveStreamModeration';
import LiveStreamSettingsPage from '@/pages/LiveStreamSettings';
import CreatePostPage from '@/pages/CreatePost';
import PostViewerPage from '@/pages/PostViewer';
import LogInPage from '@/pages/LogIn';
import AdminPage from '@/pages/Admin';
import AdminUsersPage from '@/pages/AdminUsers';
import AdminLogsPage from '@/pages/AdminLogs';
import NotFoundPage from '@/pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/post/:id" element={<PostViewerPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message-preview"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <MessagePreviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compose-message"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <ComposeMessagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <LivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live/moderation"
          element={
            <ProtectedRoute requiredRole="admin">
              <LiveStreamModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live/settings"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <LiveStreamSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute redirectIfIncomplete>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </Router>
  );
};

export default App;

