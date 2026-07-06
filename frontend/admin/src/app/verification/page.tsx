"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerificationQueue } from '../../features/verification/verificationSlice';
import { RootState, AppDispatch } from '../../store';

export default function VerificationQueue() {
  const dispatch = useDispatch<AppDispatch>();
  const { queue, loading, error } = useSelector((state: RootState) => state.verification);

  useEffect(() => {
    dispatch(fetchVerificationQueue());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Verification Queue</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Provider</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((request) => (
              <tr key={request.providerId}>
                <td className="py-2 px-4 border">{request.name}</td>
                <td className="py-2 px-4 border">{request.email}</td>
                <td className="py-2 px-4 border">{request.status}</td>
                <td className="py-2 px-4 border">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}