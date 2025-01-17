import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import "./landreport.css";
import DataTable from "../../../Components/DataTable/DataTable";

const columns = [
  {
    id: "sl_no",
    header: "Sl No.",
    accessorKey: "sl_no",
    accessorFn: (row, index) => index + 1,
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "plot_id",
    header: "Plot Id",
    accessorKey: "plot_id",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "mouza",
    header: "Mouza",
    accessorKey: "mouza_name",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "lr_plot_no",
    header: "Lr Plot No.",
    accessorKey: "lr_plot_no",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "rs_plot_no",
    header: "Rs Plot No.",
    accessorKey: "rs_plot_no",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "total_area_in_acres",
    header: "Total area (acres)",
    accessorKey: "total_area_in_acres",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "classification",
    header: "Classification",
    accessorKey: "classification",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "present_use",
    header: "Present Use",
    accessorKey: "present_use",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "owner_name_or_raiayat",
    header: "Owner Name/Raiayat",
    accessorKey: "owner_name_or_raiayat",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "lr_khatian_no",
    header: "Lr Khatian No.",
    accessorKey: "lr_khatian_no",
    sortable: true,
    cell: (info) => info.getValue(),
  },
  {
    id: "owner_address_or_raiayat",
    header: "Owner Address/Raiayat",
    accessorKey: "owner_address_or_raiayat",
    sortable: true,
    cell: (info) => info.getValue(),
  },
];

const LandReport = () => {
  const { data: lands, isLoading } = useQuery({
    queryKey: ["landRecords"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/land-all");
      return response.json();
    },
    select: (data) => data.data,
  });

  console.log(lands);

  let active = 1;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  const [renderedItems, setRenderedItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lands && index < lands.length) {
      const timer = setTimeout(() => {
        setRenderedItems((prev) => [
          ...prev,
          ...lands.slice(index, index + 50),
        ]);
        setIndex(index + 50);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, lands]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h5>Land Records</h5>
      {/* <Table striped bordered hover size="sm" responsive="lg">
        <thead className="table-active w-100">
          <tr>
            <th className="coulmn-header">Sl No.</th>
            <th className="coulmn-header">Plot Id</th>
            <th className="coulmn-header">Mouza</th>
            <th className="coulmn-header">Category</th>
            <th className="coulmn-header">Lr Plot No.</th>
            <th className="coulmn-header">Rs Plot No.</th>
            <th className="coulmn-header">Total area in acres</th>
            <th className="coulmn-header">Classification</th>
            <th className="coulmn-header">Present Use</th>
            <th className="coulmn-header">Owner Name/Raiayat</th>
            <th className="coulmn-header">Lr Khatian No.</th>
            <th className="coulmn-header">Owner Address/Raiayat</th>
          </tr>
        </thead>
        <tbody>
          {renderedItems.map((land, index) => (
            <tr key={land.objectId}>
              <td className="data-cell text-sm p-1">{index + 1}</td>
              <td className="data-cell text-sm p-1">{land.plot_id}</td>
              <td className="data-cell text-sm p-1">{land.mouza_name}</td>
              <td className="data-cell text-sm p-1">{land.category}</td>
              <td className="data-cell text-sm p-1">{land.lr_plot_no}</td>
              <td className="data-cell text-sm p-1">{land.rs_plot_no}</td>
              <td className="data-cell text-sm p-1">{land.total_area_in_acres}</td>
              <td className="data-cell text-sm p-1">{land.classification}</td>
              <td className="data-cell text-sm p-1">{land.present_use}</td>
              <td className="data-cell text-sm p-1">{land.owner_name_or_raiayat}</td>
              <td className="data-cell text-sm p-1">{land.lr_khatian_no}</td>
              <td className="data-cell text-sm p-1">{land.owner_address_or_raiayat}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}
      <div>
        <DataTable data={renderedItems} columns={columns} />
      </div>
    </div>
  );
};

export default LandReport;
