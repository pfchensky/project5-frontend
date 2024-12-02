const BASE_URL = 'http://localhost:8080';

export const fetchAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/findAllUsers`);
  return response.json();
};

export const addUser = async (user) => {
  const response = await fetch(`${BASE_URL}/saveUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

export const updateUser = async (userName, data) => {
  await fetch(`${BASE_URL}/updateByUserName`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, ...data }),
  });
};

export const deleteUser = async (userName) => {
  await fetch(`${BASE_URL}/deleteByUserName?userName=${userName}`, {
    method: 'DELETE',
  });
};

export const generateTravelPlan = async (data) => {
  const response = await fetch(`${BASE_URL}/api/ai/generate-travel-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate travel plan');
  }

  const result = await response.text();  // Use .text() to handle plain text
  return result;  // Return plain text response
};
