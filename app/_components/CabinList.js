import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

async function CabinList({ filter }) {
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let filteredCabins;
  if (filter === "all") {
    filteredCabins = cabins;
  } else if (filter === "small") {
    filteredCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  } else if (filter === "medium") {
    filteredCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    );
  } else if (filter === "large") {
    filteredCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  } else {
    notFound();
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
