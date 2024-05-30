import { Helmet } from 'react-helmet-async';
// sections
import Salary from '@/sections/Salary/view';
import React from 'react';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Salary</title>
      </Helmet>

      <Salary />
    </>
  );
}
