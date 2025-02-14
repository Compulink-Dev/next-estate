// import Listing from '../../../../lib/models/listing.model.js';
// import { connect } from '../../../../lib/mongodb/mongoose.js';
// export const POST = async (req) => {
//   await connect();
//   const data = await req.json();
//   try {
//     const startIndex = parseInt(data.startIndex) || 0;
//     const limit = parseInt(data.limit) || 9;
//     const sortDirection = data.order === 'asc' ? 1 : -1;
//     let offer = data.offer;
//     if (offer === undefined || offer === 'false') {
//       offer = { $in: [false, true] };
//     }
//     let furnished = data.furnished;
//     if (furnished === undefined || furnished === 'false') {
//       furnished = { $in: [false, true] };
//     }
//     let parking = data.parking;
//     if (parking === undefined || parking === 'false') {
//       parking = { $in: [false, true] };
//     }
//     let type = data.type;
//     if (type === undefined || type === 'all') {
//       type = { $in: ['sale', 'rent'] };
//     }
//     const listings = await Listing.find({
//       ...(data.userId && { userId: data.userId }),
//       ...(data.listingId && { _id: data.listingId }),
//       ...(data.searchTerm && {
//         $or: [
//           { name: { $regex: data.searchTerm, $options: 'i' } },
//           { description: { $regex: data.searchTerm, $options: 'i' } },
//         ],
//       }),
//       offer,
//       furnished,
//       parking,
//       type,
//     })
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);
//     return new Response(JSON.stringify(listings), {
//       status: 200,
//     });
//   } catch (error) {
//     console.log('Error getting posts:', error);
//   }
// };

import Listing from "../../../../lib/models/listing.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";

export const POST = async (req) => {
  try {
    await connect();
    const data = await req.json();

    const startIndex = parseInt(data.startIndex) || 0;
    const limit = Math.min(parseInt(data.limit) || 9, 50); // Limit results to prevent slow queries
    const sortDirection = data.order === "asc" ? 1 : -1;

    let filter = {
      ...(data.userId && { userId: data.userId }),
      ...(data.listingId && { _id: data.listingId }),
      ...(data.searchTerm && {
        $or: [
          { name: { $regex: data.searchTerm, $options: "i" } },
          { description: { $regex: data.searchTerm, $options: "i" } },
        ],
      }),
      offer:
        data.offer === "true"
          ? true
          : data.offer === "false"
          ? false
          : { $in: [false, true] },
      furnished:
        data.furnished === "true"
          ? true
          : data.furnished === "false"
          ? false
          : { $in: [false, true] },
      parking:
        data.parking === "true"
          ? true
          : data.parking === "false"
          ? false
          : { $in: [false, true] },
      type: data.type === "all" ? { $in: ["sale", "rent"] } : data.type,
    };

    const listings = await Listing.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .lean(); // Use lean() for better performance

    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
