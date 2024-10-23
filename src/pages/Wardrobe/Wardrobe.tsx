import { useCallback, useContext, useEffect, useState } from "react";
import { IGarment } from "../../interfaces";
import { UserContext } from "../../UserContext";
import { useQuery } from "@apollo/client";
import { GET_GARMENTS } from "../../graphql/queries";

const Wardrobe = () => {
    const user = useContext(UserContext);
    const [garments, SetGarments] = useState<IGarment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<string|null>(null);
    const [search, setSearch] = useState<string>('');

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const { data, refetch } = useQuery(GET_GARMENTS);

    const fetchGarments = useCallback(async () => {
        try {
            const { data } = await refetch();
            SetGarments(data.garments);
        } catch (error) {
            console.error(error);
        }
    }, [refetch])

    useEffect(() => {
        user && fetchGarments()
    }, [user, fetchGarments]);

    useEffect(() => {
        console.log(garments);
    }, [garments]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
        
    return (
        <div>
            <div className="header">
                <h1>Ma garde-robe</h1>
                <button onClick={() => toggleModal}>Ajouter un vêtement</button>
            </div>
            {
                garments.length > 0 ? <>
                <div className="toolbar">
                    <div className="filters">
                    <div className="badge" onClick={() => setFilter(null)}>Tous</div>
                    <div className="badge" onClick={() => setFilter("Haut")}>Hauts</div>
                    <div className="badge" onClick={() => setFilter("Bas")}>Bas</div>
                    <div className="badge" onClick={() => setFilter("Chaussures")}>Chaussures</div>
                    </div>
                    <div className="searchbar">
                        <input type="search" placeholder="Rechercher" value={search} onChange={(e) => handleSearch(e)}/>
                    </div>
                </div>
                <div className="garments">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        {
                            filter ? garments.filter(garment => garment.category.includes(filter)).map(garment => (
                                <div key={garment.id} className="col">
                                    <div className="card">
                                        <img src={garment.imageUrl} alt={garment.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{garment.name}</h5>
                                            <p className="card-text">{garment.brand}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : 
                            search ? garments.filter(garment => garment.name.toLowerCase().includes(search.toLowerCase())).map(garment => (
                                <div key={garment.id} className="col">
                                    <div className="card">
                                        <img src={garment.imageUrl} alt={garment.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{garment.name}</h5>
                                            <p className="card-text">{garment.brand}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : garments.map(garment => (
                                <div key={garment.id} className="col">
                                    <div className="card">
                                        <img src={garment.imageUrl} alt={garment.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{garment.name}</h5>
                                            <p className="card-text">{garment.brand}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        
                    </div>
                </div>
                </>
                : 
                <></>
            }
        </div>
    );
}

export default Wardrobe;