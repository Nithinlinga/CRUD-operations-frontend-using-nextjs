'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', class: '', roll_number: '' });
  const [editingStudent, setEditingStudent] = useState(null); // Track which student is being edited
  const [newStudent, setNewStudent] = useState({ name: '', class: '', roll_number: '' }); // For creating new student

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://crud-operations-backend-using-express.vercel.app/api/students');
      setStudents(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch students. Please try again later.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://crud-operations-backend-using-express.vercel.app/api/students/${id}`);
      fetchStudents(); // Refresh after deleting
    } catch (error) {
      setErrorMessage('Failed to delete student. Please try again later.');
      console.error(error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student); // Set the student being edited
    setForm({ name: student.name, class: student.class, roll_number: student.roll_number });
  };

  const handleUpdate = async () => {
    const { name, class: studentClass, roll_number } = form;
  
    // Check if any field is empty
    if (!name || !studentClass || !roll_number) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    // Check if the new values are the same as the current values
    if (
      name === editingStudent.name &&
      studentClass === editingStudent.class &&
      roll_number === editingStudent.roll_number
    ) {
      setErrorMessage('No changes detected. Please modify the fields to update.');
      return;
    }
  
    try {
      // Make the API call to update the student information
      await axios.put(`https://crud-operations-backend-using-express.vercel.app/api/students/${editingStudent.id}`, form);
      fetchStudents(); // Refresh the students list after updating
      setEditingStudent(null); // Reset editing mode
    } catch (error) {
      setErrorMessage('Failed to update student. Please try again later.');
      console.error(error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    // Destructure values from newStudent
    const { name, class: studentClass, roll_number } = newStudent;
    
    // Check if any of the fields are empty
    if (!name || !studentClass || !roll_number) {
      setErrorMessage('All fields are required!'); // Error message for empty fields
      return;
    }

    try {
      // Make the API call to create a new student
      await axios.post('https://crud-operations-backend-using-express.vercel.app/api/students', newStudent);
      fetchStudents(); // Refresh the student list after adding
      setNewStudent({ name: '', class: '', roll_number: '' }); 
    } catch (error) {
      // Handle errors during the API request
      setErrorMessage('Failed to create student. Please try again later.');
      console.error(error);
    }
  };  
  return (
    <div className="p-4">
      <h1 className=" flex justify-center text-3xl font-bold mb-6">Student Management</h1>

      {/* Create Student Form */}
      <h2 className="text-2xl mb-4">Add New Student</h2>
      <form onSubmit={handleCreateStudent} className="space-y-4 mb-6">
  <div className="flex flex- justify-center gap-5  ">
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={newStudent.name}
      onChange={handleCreateInputChange}
      className="w-full sm:w-1/3 md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md"
    />
    <input
      type="text"
      name="class"
      placeholder="Class"
      value={newStudent.class}
      onChange={handleCreateInputChange}
      className="w-full sm:w-1/3 md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md"
    />
    <input
      type="number"
      name="roll_number"
      placeholder="Roll Number"
      value={newStudent.roll_number}
      onChange={handleCreateInputChange}
      className="w-full sm:w-1/3 md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md"
    />
    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-1/3 ">
    Add 
  </button>
  </div>
  
</form>

        {/* Student Table */}
        <div className="overflow-x-auto">
    <table className="min-w-full table-auto table-layout-fixed">
      <thead>
        <tr className="bg-gray-100 w-full">
          <th className="px-4 py-2 text-center w-1/6 ">ID</th>
          <th className="px-4 py-2 text-center w-1/6">Name</th>
          <th className="px-4 py-2 text-center w-1/6">Class</th>
          <th className="px-4 py-2 text-center w-1/6">Roll Number</th>
          <th className="px-4 py-2 text-center w-1/6">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b">
            <td className="px-4 py-2 text-center w-1/6">{student.id}</td>
            <td className="px-4 py-2 text-center w-1/6">
              {editingStudent?.id === student.id ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full h-10 p-2 border border-gray-300 rounded-md"
                />
              ) : (
                student.name
              )}
            </td>
            <td className="px-4 py-2 text-center ">
              {editingStudent?.id === student.id ? (
                <input
                  type="text"
                  name="class"
                  value={form.class}
                  onChange={handleInputChange}
                  className="w-full h-10 p-2 border border-gray-300 rounded-md"
                />
              ) : (
                student.class
              )}
            </td>
            <td className="px-4 py-2 text-center w-1/6">
              {editingStudent?.id === student.id ? (
                <input
                  type="number"
                  name="roll_number"
                  value={form.roll_number}
                  onChange={handleInputChange}
                  className="w-full h-10 p-2 border border-gray-300 rounded-md"
                />
              ) : (
                student.roll_number
              )}
            </td>
            <td className="px-10 py-2 flex space-x-2">
              {editingStudent?.id === student.id ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white p-2 rounded-md w-20"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(student)}
                  className="bg-blue-500 text-white p-2 rounded-md w-20"
                >
                  Update
                </button>
              )}
              <button
                onClick={() => handleDelete(student.id)}
                className="bg-red-500 text-white p-2 rounded-md w-20"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    </div>
  );
}
