import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import EmptyCupNavbar from './components/EmptyCupNavbar'
import EmptyCup from './pages/EmptyCup'
import { useThemeStore } from './store/useThemeStore'


const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme, setTheme} = useThemeStore();

  console.log({onlineUsers});

  useEffect(() => {
    // document.documentElement.setAttribute('data-theme', 'winter');
    checkAuth();
    console.log('Current theme:', theme);
console.log('data-theme on HTML:', document.documentElement.getAttribute('data-theme'));

  }, [checkAuth]);

  console.log({authUser});

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  const isEmptyCupPage = location.pathname === '/emptycup';


  return (
    <div data-theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      {isEmptyCupPage ? <EmptyCupNavbar /> : <Navbar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>: <Navigate to='/login' />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/>: <Navigate to='/'/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to='/'/>}/>
        <Route path='/settings' element={authUser ? <SettingsPage/>: <Navigate to='/settings' />}/>
        <Route path='/profile' element={authUser ? <ProfilePage/>: <Navigate to='/'/>}/>
        <Route path='/emptycup' element={<EmptyCup/>}/>
      </Routes>
    </div>
  )
}

export default App
