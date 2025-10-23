// // This page user for staff to create swap transaction
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAsyncHandler } from "../../hooks/useAsyncHandler";

// // Validation schema using Zod
// const swapRequestSchema = z.object({
//     vehicleId: z.string().nonempty("Vui lòng chọn xe"),
//     stationId: z.string().nonempty("Vui lòng chọn trạm"),
//     batteryTakenId: z.string().nonempty("Vui lòng chọn pin lấy"),
//     batteryReturnedId: z.string().nonempty("Vui lòng chọn pin trả"),
// });



// // Table swap_transactions {
// //   transaction_id int[pk, increment]
// //   user_id int[ref: > users.user_id]
// //   vehicle_id int[ref: > vehicles.vehicle_id]
// //   station_id int[ref: > changing_stations.station_id]
// //   battery_taken_id int[ref: > batteries.battery_id]
// //   battery_returned_id int[ref: > batteries.battery_id]
// //   subscription_id int[ref: > subscription.subscription_id]
// //   createAT datetime
// //   updateAt datetime
// //   status enum('completed', 'failed', 'cancelled')
// // }