import { Helmet } from 'react-helmet-async';
// sections
import Worksheet1 from '@/sections/Worksheet1/view';
import React from 'react';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Worksheet</title>
      </Helmet>

      <Worksheet1/>
    </>
  );
}
