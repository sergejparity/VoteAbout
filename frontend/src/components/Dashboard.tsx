"use client";

import React, { useState, useEffect } from 'react';
import PollList from './PollList';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <PollList />
    </div>
  );
};

export default Dashboard;
