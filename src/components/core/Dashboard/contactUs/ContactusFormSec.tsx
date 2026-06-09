"use client"
import React from 'react'
import { Grid } from '@mui/material'
import { CustomButtonRounded } from '@/components/ui/Dashboard/CustomButtonRounded'
import CustomInputContactUs from '@/components/ui/Dashboard/CustomInputContactUs'
import * as Yup from 'yup'
import {AboutContactFormStyled} from '@/styledComponents/ContactUs/ContactUsFormStyled'
const Inputdata = [
  { label: "First Name", name: "firstName" },
  { label: "Last Name", name: "lastName" },
  { label: "Email", name: "email" },
  { label: "Phone Number", name: "phoneNumber" },
]

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;
type Touched = Partial<Record<keyof FormData, boolean>>;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .required('Phone number is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
    .required('Message is required'),
})



const ContactusFormSec: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Touched>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    validateField(field, formData[field]);
  };

  const validateField = async (fieldName: keyof FormData, value: string) => {
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    } catch (error: unknown) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: (error as Error).message
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: Errors = {};
      if (error instanceof Yup.ValidationError && error.inner) {
        error.inner.forEach((err: Yup.ValidationError) => {
          if (err.path) newErrors[err.path as keyof FormData] = err.message;
        });
      }
      setErrors(newErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        message: true
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = await validateForm();

    if (isValid) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Form submitted successfully!');

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
        setTouched({});
      } catch {
        alert('Error submitting form. Please try again.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <AboutContactFormStyled>
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={4} columnSpacing={2.5}>
          {Inputdata.map((input, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <CustomInputContactUs
                label={input.label}
                value={formData[input.name as keyof FormData]}
                onChange={handleChange(input.name as keyof FormData)}
                onBlur={handleBlur(input.name as keyof FormData)}
                type={input.name === "email" ? "email" : input.name === "phoneNumber" ? "tel" : "text"}
                required
                error={Boolean(touched[input.name as keyof FormData] && errors[input.name as keyof FormData])}
                helperText={touched[input.name as keyof FormData] ? errors[input.name as keyof FormData] : undefined}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12 }} >
            <CustomInputContactUs
              label="Message"
              value={formData.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              multiline
              rows={4}
              required
              error={Boolean(touched.message && errors.message)}
              helperText={touched.message ? errors.message : undefined}
            />
          </Grid>
          <Grid size={{ xs: 12 }} >
            <CustomButtonRounded
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disableRipple
              isSubmitting={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </CustomButtonRounded>
          </Grid>
        </Grid>
      </form>
    </AboutContactFormStyled>
  );
};

export default ContactusFormSec
