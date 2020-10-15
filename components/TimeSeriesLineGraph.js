import { useQuery } from "react-query";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

import { colors } from "../constants";

const fetchTimeSeriesData = async (
  type,
  statement,
  start,
  end,
  breakdown,
  resolution
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/graph/TimeSeries?${
      type === "date" && end !== ""
        ? `start=${start}&end=${end}`
        : `statement=${statement}`
    }&breakdown=${breakdown}&resolution=${resolution}`
  );

  // re-structure data
  let arr = [];

  res.data.series.map((series) =>
    series.dataPoints.map((point) => {
      const label = series.label;
      const timestamp = new Date(point.time).getTime();

      if (arr.some((obj) => obj.timestamp === timestamp)) {
        arr = arr.map((obj) =>
          obj.timestamp === timestamp ? { ...obj, [label]: point.value } : obj
        );
      } else {
        arr.push({
          time: point.time,
          timestamp: new Date(point.time).getTime(),
          [label]: point.value,
        });
      }
    })
  );

  // sort data by timestamp in ascending order
  const sorted = arr.sort((a, b) => a.timestamp - b.timestamp);

  const labels = res.data.series.map((series) => series.label);

  return { sorted, labels };
};

const TimeSeriesLineGraph = ({ query, size }) => {
  const { type, statement, start, end, breakdown, resolution } = query;

  const { data, error, isLoading } = useQuery(
    [type, statement, start, end, breakdown, resolution],
    fetchTimeSeriesData
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    !isLoading && (
      <ResponsiveContainer
        width={size === "small" ? 700 : "100%"}
        height={size === "small" ? 300 : "100%"}
      >
        <LineChart
          data={data.sorted}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.labels.map((label, index) => (
            <Line
              key={index}
              connectNulls
              type="monotone"
              dataKey={label}
              name={label}
              stroke={colors[index % colors.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  );
};

export default TimeSeriesLineGraph;
