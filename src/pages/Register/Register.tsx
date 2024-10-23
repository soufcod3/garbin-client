// import styles from "../features/auth/assets/auth.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { CREATE_USER } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";

interface IFormInput {
    email: string
    username: string
    password: string
    confirmPassword: string
  }


const Register = () => {
  // get user
  const user = useContext(UserContext);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<IFormInput>();
  const navigate = useNavigate();
  
  const [doSignupMutation, { data, loading, error }] = useMutation(CREATE_USER);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      // Execute mutation with form data
      await doSignupMutation({
        variables: {
          data: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
        },
      });
      navigate('/connexion');

    } catch (err) {
      console.error("Signup failed", err);
    }
  };
//   async function doSignup(e: any) {
//     e.preventDefault(e);
//     try {
//       await doSignupMutation({
//         variables: {
//           data: {
//             email: form.getValues().email,
//             username: form.getValues().username,
//             password: form.getValues().password,
//           },
//         },
//       });
//     } catch {}
//   }



  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-20 text-center">
      <div className="header mb-10">
        <h3 className="font-semibold">Inscrivez-vous</h3>
        <Link to={"/connexion"}>
          <small>Déjà un compte ?</small>
        </Link>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Adresse e-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="exemple@mail.fr"
            {...register("email", { required: "Ce champs est obligatoire" })}
          />
          <Form.Text className="text-muted">
            Votre adresse ne sera jamais partagée avec qui que ce soit.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom d'utilisateur"
            {...register("username", { required: "Ce champs est obligatoire" })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mot de passe"
            {...register("password", { required: "Ce champs est obligatoire" })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirmez le mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmez le mot de passe"
            {...register("confirmPassword", { required: "Ce champs est obligatoire" })}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!isValid || loading}>
          Créer un compte
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
