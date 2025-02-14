"use client";
import { useEffect, useState } from "react";
import ListingItem from "../../../components/ListingItem";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch("/api/listing/get", {
        method: "POST",
        body: JSON.stringify({
          searchTerm: sidebardata.searchTerm,
          type: sidebardata.type,
          parking: sidebardata.parking,
          furnished: sidebardata.furnished,
          offer: sidebardata.offer,
          sort: sidebardata.sort,
          order: sidebardata.order,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [searchParams]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap font-semibold">
              Search Term:
            </Label>
            <Input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Label className="font-semibold">Type:</Label>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span className="text-xs text-slate-400">Rent & Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span className="text-xs text-slate-400">Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span className="text-xs text-slate-400">Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span className="text-xs text-slate-400">Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Label className="font-semibold">Amenities:</Label>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span className="text-xs text-slate-400">Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span className="text-xs text-slate-400">Furnished</span>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <Label className="font-semibold">Sort:</Label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div> */}
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Sort:</Label>
            <Select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem value="apple">Price high to low</SelectItem>
                  <SelectItem value="banana">Price low to hight</SelectItem>
                  <SelectItem value="blueberry">Latest</SelectItem>
                  <SelectItem value="grapes">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-slate-700 text-white hover:opacity-95">
            Search
          </Button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-sm text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <Button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline text-center w-full"
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
