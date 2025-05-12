import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SocialAuthSuccess = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);

            if (decoded.role) {
                localStorage.setItem('role', decoded.role);
            }

            navigate('/');
        } else {
            navigate('/');
        }
    }, []);

    return <p className="text-center text-green-700 mt-10">Logging you in...</p>;
};

export default SocialAuthSuccess;
