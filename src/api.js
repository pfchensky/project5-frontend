export const fetchUsers = async () => {
    const response = await fetch('http://localhost:8080/findAllUsers');
    const data = await response.json();
    return data;
  };
  
  export const addUser = async (user) => {
    const response = await fetch('http://localhost:8080/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  };
  
  export const updateUser = async (username) => {
    // Example for user update request, you can update it according to your requirements
  };
  
  export const deleteUser = async (username) => {
    // Example for user delete request, you can update it according to your requirements
  };
  
  export const generateTravelPlans = async (users, tripInfo) => {
    const response = await fetch('http://localhost:8080/api/ai/generate-travel-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users, tripInfo }),
    });
    const data = await response.json();
    return data;
  };
