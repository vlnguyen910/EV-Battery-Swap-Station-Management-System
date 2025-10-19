// // This page user for staff to create swap transaction
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAsyncHandler } from "../../hooks/useAsyncHandler";
// import { createSwapTransaction } from "../../services/swapService";

// const schema = z.object({
//   user_id: z.number().min(1).optional(),
//   vehicle_id: z.number().min(1).optional(),
//   station_id: z.number().min(1).optional(),
//   battery_taken_id: z.number().min(1).optional(),
//   battery_returned_id: z.number().min(1).optional(),
//   subscription_id: z.number().min(1).optional(),
// });


// export default function SwapRequest() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const { execute: createSwap, isLoading } = useAsyncHandler(createSwapTransaction);

//   const onSubmit = async (data) => {
//     const result = await createSwap(data);
//     console.log("Swap transaction created:", result);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <label>User ID</label>
//         <input type="number" {...register("user_id")} />
//         {errors.user_id && <p>{errors.user_id.message}</p>}
//       </div>
//       <div>
//         <label>Vehicle ID</label>
//         <input type="number" {...register("vehicle_id")} />
//         {errors.vehicle_id && <p>{errors.vehicle_id.message}</p>}
//       </div>
//       <div>
//         <label>Station ID</label>
//         <input type="number" {...register("station_id")} />
//         {errors.station_id && <p>{errors.station_id.message}</p>}
//       </div>
//       <div>
//         <label>Battery Taken ID</label>
//         <input type="number" {...register("battery_taken_id")} />
//         {errors.battery_taken_id && <p>{errors.battery_taken_id.message}</p>}
//       </div>
//       <div>
//         <label>Battery Returned ID</label>
//         <input type="number" {...register("battery_returned_id")} />
//         {errors.battery_returned_id && <p>{errors.battery_returned_id.message}</p>}
//       </div>
//       <div>
//         <label>Subscription ID</label>
//         <input type="number" {...register("subscription_id")} />
//         {errors.subscription_id && <p>{errors.subscription_id.message}</p>}
//       </div>
//       <button type="submit" disabled={isLoading}>
//         {isLoading ? "Creating..." : "Create Swap Transaction"}
//       </button>
//     </form>
//   );
// }


// Table swap_transactions {
//   transaction_id int[pk, increment]
//   user_id int[ref: > users.user_id]
//   vehicle_id int[ref: > vehicles.vehicle_id]
//   station_id int[ref: > changing_stations.station_id]
//   battery_taken_id int[ref: > batteries.battery_id]
//   battery_returned_id int[ref: > batteries.battery_id]
//   subscription_id int[ref: > subscription.subscription_id]
//   createAT datetime
//   updateAt datetime
//   status enum('completed', 'failed', 'cancelled')
// }