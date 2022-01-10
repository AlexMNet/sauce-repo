/* eslint-disable */
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log(username, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/users/login',
      data: {
        username,
        password,
      },
    });
    if (res.status === 200) {
      window.setTimeout(() => {
        location.assign('/');
      }, 250);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
});
