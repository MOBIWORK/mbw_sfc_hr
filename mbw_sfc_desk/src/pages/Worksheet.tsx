import { Helmet } from 'react-helmet-async';
// sections
import Worksheet from '@/sections/Worksheet/view';
import React from 'react';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Worksheet</title>
      </Helmet>

      <Worksheet />
    </>
  );
}
