const eye = document.getElementById('eye');
const pupil = document.getElementById('pupil');
const passwordField = document.getElementById('password');

document.addEventListener('mousemove', (e) => {
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientX - eyeX, e.clientY - eyeY);
    const pupilX = Math.cos(angle) * 5;
    const pupilY = Math.sin(angle) * 5;
    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
});

passwordField.addEventListener('focus', () => {
    eye.style.backgroundColor = '#834b8f';
    pupil.style.display = 'none';
});

passwordField.addEventListener('blur', () => {
    eye.style.backgroundColor = 'white';
    pupil.style.display = 'block';
});
