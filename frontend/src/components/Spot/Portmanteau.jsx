import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as spotActions from '../../store/spots';
import './Portmanteau.css';

function PortmanteauSpot(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { spotId } = useParams();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [errors, setErrors] = useState({});
    const [altImages, setAltImages] = useState({ 0: '', 1: '', 2: '', 3: ''});
    const [submit, setSubmit] = useState(false);

    // useEffect(() => {
    //     if (spotId){
    //         dispatch()
    //     }
    // })

    const validateImages = () => {
        const imgErrs = {};
        const imgUrls = [previewImg, ...Object.values(altImages)];

        imgUrls.forEach((url, index) => {
            if (url && !url.match(/\.(jpg|jpeg|png)$/)){
                imgErrs[`image${index+1}`] = "Image URL needs to end in png, jpg, or jpeg";
            }
        });
        return imgErrs;
    };

    const spotValidations = () => {
        const newSpotErr = {};

        if (!country) newSpotErr.country = 'Country is required';
        if (!address) newSpotErr.address = 'Address is required';
        if (!city) newSpotErr.city = 'City is required';
        if (!state) newSpotErr.state = 'State is required';
        if (!lat) newSpotErr.lat = 'Latitude is required';
        else if (parseFloat(lat) > 90 || parseFloat(lat) < -90) newSpotErr.lat = 'Invalid latitude';
        if (!lng) newSpotErr.lng = 'Longitude is required';
        else if (parseFloat(lng) > 180 || parseFloat(lng) < -180) newSpotErr.lng = 'Invalid longitude';
        if (!description || description.length < 30) newSpotErr.description = 'Description needs a minimum of 30 characters'
        if (!name) newSpotErr.name = 'Name is required';
        if (!price) newSpotErr.price = 'Price is required';
        if (!previewImg) newSpotErr.previewImg = 'Preview image is required';
        else if (previewImg && !previewImg.match(/\.(jpg|jpeg|png)$/)) newSpotErr.previewImg = 'Image URL needs to end in png, jpg, or jpeg';
        
        const imgErrors = validateImages();
        return {...newSpotErr, ...imgErrors}
    };
    
    const handleImageChange = (e, index) => {
        const newAltImages = {...altImages, [index]: e.target.value };
        setAltImages(newAltImages);
    };

    const reset = () => {
        setAddress('');
        setCity('');
        setState('');
        setCountry('');
        setLat('');
        setLng('');
        setName('');
        setDescription('');
        setPrice('');
        setAltImages({ 0: '', 1: '', 2: '', 3: ''})
        setPreviewImg('');
        setErrors({});
    };

    // useEffect(() => {
    //     const errors = spotValidations();
    //     if (!Object.keys(errors).length) setDisableButton(false);
    // })

    // 3 options
    // 1. Multiple img; add all urls into an array; loop through this in handle submit & dispatch a thunk inside the loop to create Spot image 
    // 2. pass the image array to create Spot thunk & loop through and make a fetch to api/spot/${spotId}/image
    const handleSubmit = async e => {
        e.preventDefault();
        const allErrors = spotValidations();
        setErrors(allErrors);

        let newSpot;
        const allImages = [previewImg, ...Object.values(altImages)];
        if (Object.keys(errors).length === 0){
            newSpot = {
                address,
                city,
                state,
                country,
                lat: Number(lat),
                lng: Number(lng),
                name,
                description,
                price
            };

            allImages.map((img, i) => {
                if (img && i == 0){
                    allImages[i] = {
                        id: newSpot.id,
                        url: img,
                        preview: true
                    }
                } else {
                    allImages[i] = {
                        id: newSpot.id,
                        url: img,
                        preview: false
                    }
                }
            })

            const createdSpot = await dispatch(spotActions.createOneSpot(newSpot, allImages));
            reset();
            navigate(`/spots/${createdSpot.id}`);
        }

    };

    return (
        <div className='new-spot-form'>
            <h1>Create a new Spot</h1>
            <form onSubmit={handleSubmit}>
                <div className='spot-creation-location-container'>
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label>
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    </label>
                    {errors.country && <p className="spot-errors">{errors.country}</p>}
                    <label>
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.address && <p className="spot-errors">{errors.address}</p>}
                    <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.city && <p className="spot-errors">{errors.city}</p>}
                    <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.state && <p className="spot-errors">{errors.state}</p>}
                    <label>
                    Latitude
                    <input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.lat && <p className="spot-errors">{errors.lat}</p>}
                    <label>
                    Longitude
                    <input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.lng && <p className="spot-errors">{errors.lng}</p>}
                </div>

                <div className="spot-creation-description-container">
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <label>
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        // required
                    />
                    </label>
                    {errors.description && <p className="spot-errors">{errors.description}</p>}
                </div>

                <div className="spot-creation-name-container">
                <h2>Create a title for your spot</h2>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        // required
                    />
                    {errors.name && <p className='spot-errors'>{errors.name}</p>}
                </div>

                <div className='spot-creation-price-container'>
                    {/* Price Field */}
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            // required
                        />
                    {errors.price && <p className='spot-errors'>{errors.price}</p>}
                </div>

                <div className='spot-creation-image-container'>
                    {/* Image URL Field */}
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <label>
                        Preview Image URL
                        <input
                            type="text"
                            value={previewImg}
                            onChange={(e) => setPreviewImg(e.target.value)}
                            // required
                        />
                    </label>
                    {errors.previewImg && <p className='spot-errors'>{errors.previewImg}</p>}

                    {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                        <label>
                            Image URL {index + 2} {/* Start numbering from 2 */}
                            <input
                                type="text"
                                value={altImages[index]}
                                onChange={(e) => handleImageChange(e, index)}
                            />
                        </label>
                        {errors[`image${index + 2}`] && <p className='spot-errors'>{errors[`image${index + 2}`]}</p>}
                    </div>
                    ))}
                </div>

                <div className ='spot-creation-button'>
                    <button type='submit'>Create a Spot</button>
                </div>
            </form>
        </div>
    );
}

export default PortmanteauSpot;