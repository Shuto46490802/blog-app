// react
import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// library
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  setDoc,
  where
} from '@firebase/firestore'

// src
import { db } from './Utils/firebase'
import GlobalLayout from './Components/Layouts/GlobalLayout'
import { UserProvider } from './Context/user-context'
import WriteStory from './Routes/WriteStory'

function App() {
  useEffect(() => {}, [])

  const getUser = () => {
    getDocs(collection(db, 'user')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    })
  }

  const getUserById = () => {
    const user = query(
      collection(db, 'user'),
      where(documentId(), '==', 'jOtx4qUMjj2yq3s2G48r')
    )
    getDocs(user).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    })
  }

  const addNewUser = () => {
    addDoc(collection(db, 'user'), {
      name: 'Jess'
    })
  }

  const updateUser = () => {
    setDoc(
      doc(db, 'user', 'jOtx4qUMjj2yq3s2G48r'),
      { age: 29 },
      { merge: true }
    )
  }
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path='/' element={<GlobalLayout />}>
            <Route path='write-story' element={<WriteStory />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
