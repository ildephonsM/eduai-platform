import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import Flag from 'react-world-flags';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing

const countryOptions = [
  { code: 'ZA', dialCode: '+27', label: 'South Africa' },
  { code: 'US', dialCode: '+1', label: 'USA' },
  { code: 'GB', dialCode: '+44', label: 'UK' },
  { code: 'IN', dialCode: '+91', label: 'India' },
];

const RegisterModal = ({ setLoggedIn, setIsRegisterModal }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]); // Default country
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false); // For toggling dropdown

  const validateName = (value) => /^[A-Za-z]+$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateCellphone = (value) => /^\d{9}$/.test(value);

/*   const handleBlur = (field, value) => {
    const newErrors = { ...errors };

    if (field === 'name' && !validateName(value)) {
      newErrors.name = 'Name must contain only letters';
    } else if (field === 'surname' && !validateName(value)) {
      newErrors.surname = 'Surname must contain only letters';
    } else if (field === 'email' && !validateEmail(value)) {
      newErrors.email = 'Invalid email format';
    } else if (field === 'cellphone' && !validateCellphone(value)) {
      newErrors.cellphone = 'Cellphone must contain exactly 9 digits';
    } else {
      delete newErrors[field];
    }

    setErrors(newErrors);
  }; */

  const handleSubmit = async () => {
    if (Object.keys(errors).length === 0) {
        try {
            // Log registration data
            const hashedPassword = await bcrypt.hash(password, 10);
            const registrationData = {
                Name: name,
                Surname: surname,
                Email: email,
                Country: selectedCountry.label,
                Cellphone: cellphone,
                CountryCode: selectedCountry.code,
                Password: hashedPassword,
            };

            console.log('Sending registration data:', registrationData); // Log data

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, registrationData);

            if (response.status === 201) {
                setLoggedIn(true);
                setIsRegisterModal(false);
            }
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            alert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
        }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Register</h3>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          //onBlur={() => handleBlur('name', name)}
          className={`mb-2 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        <Input
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          //onBlur={() => handleBlur('surname', surname)}
          className={`mb-2 ${errors.surname ? 'border-red-500' : ''}`}
        />
        {errors.surname && <p className="text-red-500 text-sm mb-2">{errors.surname}</p>}

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //onBlur={() => handleBlur('email', email)}
          className={`mb-2 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        {/* Custom Country Code Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 border rounded w-full flex items-center justify-between"
          >
            <div className="flex items-center">
              <Flag code={selectedCountry.code} style={{ width: '20px', height: '15px' }} />
              <span className="ml-2">{selectedCountry.dialCode}</span>
            </div>
            <span>{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-10">
              {countryOptions.map((option) => (
                <div
                  key={option.code}
                  onClick={() => {
                    setSelectedCountry(option);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Flag code={option.code} style={{ width: '20px', height: '15px' }} />
                  <span className="ml-2">{option.dialCode}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          placeholder="Cellphone (9 digits)"
          value={cellphone}
          onChange={(e) => setCellphone(e.target.value)}
          //onBlur={() => handleBlur('cellphone', cellphone)}
          className={`w-full mb-4 ${errors.cellphone ? 'border-red-500' : ''}`}
        />
        {errors.cellphone && <p className="text-red-500 text-sm mb-2">{errors.cellphone}</p>}

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
        />

        <div className="flex justify-between">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsRegisterModal(false)}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
