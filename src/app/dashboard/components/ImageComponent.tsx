import { useEffect, useState } from 'react';
const fetchImage = async () => {
    try {
        console.log('Fetching image...');
        const response = await fetch(`http://localhost:5015/api/image/client/profile`, {
            method: 'GET',
            credentials: 'include',
        })
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};
const ImageDisplay = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            const imageUrl = await fetchImage();
            setImageSrc(imageUrl);
        };

        loadImage();

        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, []);
    if (!imageSrc) return <p style={{ color: 'red' }}>TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA TROCA</p>;

    return <img src={imageSrc} alt="PFP" />;
};

export default ImageDisplay;
