import { features } from "../lib/utils/constants";

const FeatureCards = () => (
  <div className="w-full padding-x-lg mb-10">
    <div className="mx-auto grid-3-cols">
      {features.map(({ title, description }) => (
        <div
          key={title}
          className="card-border rounded-xl p-8 flex flex-col gap-4"
        >
          {/*<div className="size-14 flex items-center justify-center rounded-full">
            <img src={imgPath} alt={title} />
          </div>*/}
          <h3 className="text-white text-2xl font-semibold mt-2">{title}</h3>
          <p className="text-white-50 text-lg">{description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FeatureCards;