import { date, number, object, string } from "yup";

const EventSchema = object({
    image: string()
        .trim()
        .notRequired(),
    title: string()
        .required(),
    eventDate: date()
        .required("Date is required"),
    overview: string()
        .max(100)
        .required(),
    genre: string()
        .required(),
    venue: string()
        .required(),
    eventDesc: string()
        .required(),
    maxNormals: number()
        .moreThan(-1),
    maxVIPs: number()
        .moreThan(-1),
    normalPrice: number()
        .moreThan(-1),
    VIPPrice: number()
        .moreThan(-1),
    discountType: string()
        .required(),
});

export { 
    EventSchema,
};