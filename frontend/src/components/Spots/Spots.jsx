import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function Spots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotObject = useSelector(state => state.spots);
    const spotArr = Object.values(spotObject);

    useEffect(() => {
        dispatch(SpotActions.getAllSpots());
    }, [dispatch])

    if (!spotArr.length){
        return (
            <div>
                <h1>Currently, there are no spots available</h1>
            </div>
        )
    }
    console.log(spotObject)

    return (
        <>
            <div>
                {spotArr.map(spot => {
                    return (
                        <div key={spot.id} className='spot-block' onClick={() => navigate(`/spots/${spot.id}`)}>
                                <img
                                    className='spot-image'
                                    alt={spot.previewImage}
                                    src={spot.previewImage} />
                                <p>{spot.name}</p>
                                <p>{spot.price}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Spots;