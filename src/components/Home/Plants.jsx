import Card from "./Card";
import Container from "../Shared/Container";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";
const Plants = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/plants`);
      return result.data
    },
  });
  console.log(data)
  if(isLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <Container>
      <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {
          data.map(plant =><Card plant={plant} key={plant._id}/>)
        }
      </div>
    </Container>
  );
};

export default Plants;
