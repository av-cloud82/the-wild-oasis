"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function FilterCabins() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex align-middle border border-primary-800 text-primary-200 mb-4">
      <FilterButton
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All cabins
      </FilterButton>
      <FilterButton
        filter="small"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        4 - 7 cabins
      </FilterButton>
      <FilterButton
        filter="medium"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        4 - 7 cabins
      </FilterButton>
      <FilterButton
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        8 - 12 cabins
      </FilterButton>
    </div>
  );
}

function FilterButton({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-6 py-1.5 hover:bg-primary-800 ${filter === activeFilter ? "bg-primary-800" : ""}`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default FilterCabins;
