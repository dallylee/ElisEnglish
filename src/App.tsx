import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Layout from './components/Layout/Layout';
import HomeScreen from './components/Home/HomeScreen';
import LessonBrowser from './components/Lessons/LessonBrowser';
import LessonPlayer from './components/Lessons/LessonPlayer';
import BadgeGallery from './components/Badges/BadgeGallery';
import Settings from './components/Settings/Settings';
import TutorDashboard from './components/Tutor/TutorDashboard';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router basename="/ElisEnglish">
          <Layout>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/lessons" element={<LessonBrowser />} />
              <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
              <Route path="/badges" element={<BadgeGallery />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tutor" element={<TutorDashboard />} />
            </Routes>
          </Layout>
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
