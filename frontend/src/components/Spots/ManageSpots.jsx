import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import SpotCard from "../Spot/SpotCard";
import '../Spots/Spots.css';


function ManageSpots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.user);
    const allSpots = useSelector(state => state.spots.spots);
    const userSpots = Object.values(allSpots).filter(spot => spot.ownerId == currentUser.id);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

    if (!userSpots.length) return (
        <div className="manage-header-container">
            <button className='manage-spots' onClick={() => navigate('/spots/new')}>Create a New Spot</button>
        </div>
        )

    return (
        <>
            <div className="manage-header-container">
                <h1>Manage Your Spots</h1>
                <button className='manage-spots' onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            </div>

            <div className='spots-container'>
                {userSpots.map(spot => (
                        <SpotCard spot={spot} key={spot.id} />
                ))}
            </div>
        </>
    )

}

export default ManageSpots;