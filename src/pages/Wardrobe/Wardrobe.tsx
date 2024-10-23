import { useCallback, useContext, useEffect, useState } from "react";
import { IGarment } from "../../interfaces";
import { UserContext } from "../../UserContext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_GARMENTS } from "../../graphql/queries";
import { Button, Form, Modal } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { CREATE_GARMENT } from "../../graphql/mutations";


interface IFormInput {
    name: string
    brand: string
    size: string
    category: string
    colors: string[]
}

const Wardrobe = () => {
    const user = useContext(UserContext);
    const [garments, SetGarments] = useState<IGarment[]>([]);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState<string|null>(null);
    const [search, setSearch] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [colors, setColors] = useState<string[]>([]);


    const handleClose = () => {
        setShow(false);
        resetForm();
    }
    const handleShow = () => setShow(true);

    const resetForm = () => {
        reset()
        setPreviewImage(null);
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
      } = useForm<IFormInput>();
    
    const { refetch } = useQuery(GET_GARMENTS);

    const [doCreateGarment, { data, loading, error }] = useMutation(CREATE_GARMENT);


    const fetchGarments = useCallback(async () => {
        try {
            const { data } = await refetch();
            SetGarments(data.garments);
        } catch (error) {
            console.error(error);
        }
    }, [refetch])


    const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
        try {
            console.log('?')
          // Execute mutation with form data
          await doCreateGarment({
            variables: {
              data: {
                name: formData.name,
                brand: formData.brand,
                size: formData.size,
                category: formData.category,
                colors,
                imageBase64: previewImage
              },
            },
          }).then((res) => {
            handleClose();
            fetchGarments();
          });
          
        } catch (err) {
          console.error("Signup failed", err);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            
            // For preview
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        user && fetchGarments()
    }, [user, fetchGarments]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
        
    return (
        <div>
            <div className="header">
                <h1>Ma garde-robe</h1>
                <button onClick={handleShow}>Ajouter un vêtement</button>
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
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Ajouter un vêtement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Nom de l'article</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Veste en cuir"
                                {...register("name", { required: "Ce champs est obligatoire" })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="brand">
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Jules, Nike, ..."
                                {...register("brand", { required: "Ce champs est obligatoire" })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="size">
                            <Form.Label>Taille</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="S, M, L, ..."
                                {...register("size", { required: "Ce champs est obligatoire" })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Catégorie</Form.Label>
                            <Form.Control
                                as="select"
                                {...register("category", { required: "Ce champs est obligatoire" })}
                            >
                                <option value="Haut principal">Haut principal</option>
                                <option value="Haut secondaire">Haut secondaire</option>
                                <option value="Bas">Bas</option>
                                <option value="Chaussures">Chaussures</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="color">
                            <Form.Label>Couleurs</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Jaune, rouge, ..."
                                onChange={(e) => setColors(e.target.value.split(',').map(color => color.trim()))}
                            />
                        </Form.Group>
                        
                        {/* Image input */}
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageUpload}
                            />
                        </Form.Group>

                        <div className="image-preview">
                            {
                                previewImage ?
                                <img src={previewImage} alt="preview" className="w-100"/>
                                : 
                                <img src="/empty.png" alt="none" />
                            }
                        </div>

                        <Button variant="primary" type="submit" disabled={!isValid || loading}>
                            Ajouter
                        </Button>
                    </Form>
                    </Modal.Body>
                </Modal>
                </>
                : 
                <></>
            }
        </div>
    );
}

export default Wardrobe;