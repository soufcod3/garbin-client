// import styles from "../features/auth/assets/auth.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { LOGIN } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

interface IFormInput {
  email: string;
  username: string;
  password: string;
}

const Login = (props: { onTokenChange: (token?: string) => void }) => {
  const user = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInput>();
  const navigate = useNavigate();

  const [doLoginMutation, { data, loading, error }] = useMutation(LOGIN);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      // Execute mutation with form data
      await doLoginMutation({
        variables: {
          data: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
        },
      }).then((res) => {
        console.log(res)
        console.log(res.data.login);
        props.onTokenChange(res.data.login);
      });

        navigate('/ma-garde-robe');
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-20 text-center">
      <div className="header mb-10">
        <h3 className="font-semibold">Connexion</h3>
        <Link to={"/creer-un-compte"}>
          <small>Pas encore de compte ?</small>
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

        <Button variant="primary" type="submit" disabled={!isValid || loading}>
          Me connecter
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
