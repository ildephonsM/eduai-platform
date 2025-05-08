import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import Flag from 'react-world-flags';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const countryOptions = [
  { code: 'ZA', dialCode: '+27', label: 'South Africa' },
  { code: 'US', dialCode: '+1', label: 'USA' },
  { code: 'GB', dialCode: '+44', label: 'UK' },
  { code: 'IN', dialCode: '+91', label: 'India' },
];

const RegisterModal = ({ setLoggedIn, setIsRegisterModal }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    cellphone: '',
    password: '',
    selectedCountry: countryOptions[0],
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation functions
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (!/^[A-Za-z]+$/.test(value)) return 'Name must contain only letters';
      return '';
    },
    surname: (value) => {
      if (!value.trim()) return 'Surname is required';
      if (!/^[A-Za-z]+$/.test(value)) return 'Surname must contain only letters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return '';
    },
    cellphone: (value) => {
      if (!value.trim()) return 'Cellphone is required';
      if (!/^\d{9}$/.test(value)) return 'Cellphone must contain exactly 9 digits';
      return '';
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    },
  };

  // Handle input changes
  const handleChange = (field, value) => {
    console.log(`Changing ${field} to ${value}`); // Add log here

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle input blur (validate on blur)
  const handleBlur = (field) => {
    const value = formData[field];
    const validator = validators[field];

    if (validator) {
      const error = validator(value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const value = formData[field];
      const error = validators[field](value);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Log pre-submission data
      console.log('Current Form Data Before Validation:', formData);

      // Validate all fields before submission
      /*
      if (!validateForm()) {
        console.log('Validation failed:', errors);
        setIsSubmitting(false);
        return;
      }
      */

      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Prepare registration data
      const registrationData = {
        Name: formData.name.trim(),
        Surname: formData.surname.trim(),
        Email: formData.email.trim().toLowerCase(),
        Country: formData.selectedCountry.label,
        Cellphone: formData.cellphone.trim(),
        CountryCode: formData.selectedCountry.code,
        Password: hashedPassword,
      };

      // Log registration data (without password)
      console.log('Sending registration data:', {
        ...registrationData,
        Password: '[REDACTED]',
      });

      // Make API request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setLoggedIn(true);
        setIsRegisterModal(false);
      }
    } catch (error) {
      console.error('Registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setSubmitError(
        error.response?.data?.error || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Register</h3>

        {/* Name Input */}
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`mb-2 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        {/* Surname Input */}
        <Input
          placeholder="Surname"
          value={formData.surname}
          onChange={(e) => handleChange('surname', e.target.value)}
          onBlur={() => handleBlur('surname')}
          className={`mb-2 ${errors.surname ? 'border-red-500' : ''}`}
        />
        {errors.surname && <p className="text-red-500 text-sm mb-2">{errors.surname}</p>}

        {/* Email Input */}
        <Input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`mb-2 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        {/* Country Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 border rounded w-full flex items-center justify-between"
            type="button"
          >
            <div className="flex items-center">
              <Flag code={formData.selectedCountry.code} style={{ width: '20px', height: '15px' }} />
              <span className="ml-2">{formData.selectedCountry.dialCode}</span>
            </div>
            <span>{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-10">
              {countryOptions.map((option) => (
                <div
                  key={option.code}
                  onClick={() => {
                    handleChange('selectedCountry', option);
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

        {/* Cellphone Input */}
        <Input
          placeholder="Cellphone (9 digits)"
          value={formData.cellphone}
          onChange={(e) => handleChange('cellphone', e.target.value)}
          onBlur={() => handleBlur('cellphone')}
          className={`w-full mb-2 ${errors.cellphone ? 'border-red-500' : ''}`}
        />
        {errors.cellphone && <p className="text-red-500 text-sm mb-2">{errors.cellphone}</p>}

        {/* Password Input */}
        <Input
          placeholder="Password (min 8 characters)"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          className={`mb-4 ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

        {/* Submit Error Message */}
        {submitError && <p className="text-red-500 text-sm mb-2">{submitError}</p>}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500'}`}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>

        <button onClick={() => setIsRegisterModal(false)} className="text-sm text-gray-500 mt-4">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
