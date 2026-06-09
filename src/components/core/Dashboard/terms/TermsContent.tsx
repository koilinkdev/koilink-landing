// "use client"
// import { common } from '@/theme/palette';
// import { Typography, Link, Box, styled } from '@mui/material';

// const AboutTermsContentStyled = styled(Box)`
//   color: ${common.color6D9DC5};
//   font-weight: 500;

//   a {
//     color: ${common.color6979F8};
//   }

//   .term-line {
//     font-size: 14px;
//     line-height: 1.3;
//     margin-bottom: 16px;
//     letter-spacing:0%;
//   }

//   .term-line.first-four {
//     font-size: 16px;
//     line-height: 1.5;
//     letter-spacing:0.5px;
//     margin-bottom: 18px;
//   }
// `;

// const termsLines = [
//   <>
//     Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our{' '}
//     <Link href="https://brainstorming.com" target="_blank" rel="noopener noreferrer" underline="hover">
//       website
//     </Link>
//     , and other sites we own and operate.
//   </>,
//   'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
//   "Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.",
//   'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
//   "Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.",
//   'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
//     'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   "Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.",
//   'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.',
//   'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
//   'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
// ];

// const TermsContent = () => {
//   return (
//     <AboutTermsContentStyled>
//       {termsLines.map((line, index) => (
//         <Typography
//           key={index}
//           className={`term-line ${index < 4 ? 'first-four' : ''}`}
//         >
//           {line}
//         </Typography>
//       ))}
//     </AboutTermsContentStyled>
//   );
// };

// export default TermsContent;
import React from 'react'
import CommonTermsPolicyContent from '@/components/core/Dashboard/TermsPolicy/CommonTermsPolicy'
const TermsContent= () => {
  return (
    <CommonTermsPolicyContent/>
  )
}

export default TermsContent
