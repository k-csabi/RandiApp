import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', inviteCode: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.inviteCode);
            navigate('/');
        } catch (error) {
            alert("Hiba történt! Lehet, hogy foglalt az email, vagy rossz a kód.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Regisztráció</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" placeholder="Neved"
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                        type="email" placeholder="Email címed"
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="password" placeholder="Jelszó"
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <div className="border-t pt-3 mt-3">
                        <label className="text-sm text-gray-500">Van meghívód a párodtól?</label>
                        <input
                            type="text" placeholder="Meghívó kód (Opcionális)"
                            className="w-full p-2 border rounded mt-1 bg-yellow-50"
                            onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                        />
                    </div>
                    <button className="w-full bg-pink-600 text-white p-2 rounded mt-4 hover:bg-pink-700">
                        Regisztráció
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Már van fiókod? <a href="/login" className="text-pink-600">Jelentkezz be!</a>
                </p>
            </div>
        </div>
    );
}

