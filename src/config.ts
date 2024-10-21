let API_URL: string;

if (window.location.href.includes("dunidée.fr")) {
  API_URL = "https://api.garbin.dunidée.fr";
} else {
  API_URL = "http://localhost:5001";
}
// also possible to manage other urls (like staging)

export default API_URL;
