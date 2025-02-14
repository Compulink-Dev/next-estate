import Listing from "../../../../lib/models/listing.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";

export const POST = async (req) => {
  await connect(); // Ensure DB connection
  const data = await req.json();

  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === "asc" ? 1 : -1;

    let offer = data.offer ?? { $in: [false, true] };
    let furnished = data.furnished ?? { $in: [false, true] };
    let parking = data.parking ?? { $in: [false, true] };
    let type = data.type ?? { $in: ["sale", "rent"] };

    const listings = await Listing.find({
      ...(data.userId && { userId: data.userId }),
      ...(data.listingId && { _id: data.listingId }),
      ...(data.searchTerm && {
        $or: [
          { name: { $regex: data.searchTerm, $options: "i" } },
          { description: { $regex: data.searchTerm, $options: "i" } },
        ],
      }),
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    return new Response(JSON.stringify({ success: true, data: listings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting listings:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
