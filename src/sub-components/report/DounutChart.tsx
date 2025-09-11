import { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Skeleton from "react-loading-skeleton";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import appConstants from "constants/constant";
import { SelectedOption } from "interfaces/applicant.interface";
import { getRoleWiseReport } from "api/reportApi";

const { designationType } = appConstants;

const ColumnChart = () => {
  const [filterDesignation, SetFilterDesignation] = useState<SelectedOption[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataValues, setDataValues] = useState<number[]>([]);

  // Generate dark colors dynamically for any number of items
  const generateColors = (length: number) => {
    const colors: string[] = [];
    const baseColors = [
      [44, 62, 80], // Dark Blue Gray
      [52, 73, 94], // Wet Asphalt
      [142, 68, 173], // Purple
      [155, 89, 182], // Amethyst
      [231, 76, 60], // Alizarin
      [192, 57, 43], // Pomegranate
      [230, 126, 34], // Carrot
      [211, 84, 0], // Pumpkin
      [243, 156, 18], // Orange
      [241, 196, 15], // Sunflower
      [39, 174, 96], // Nephritis
      [22, 160, 133], // Green Sea
      [41, 128, 185], // Belize Hole
      [52, 152, 219], // Peter River
      [26, 188, 156], // Turquoise
    ];

    for (let i = 0; i < length; i++) {
      if (i < baseColors.length) {
        // Use base colors for first 15
        const [r, g, b] = baseColors[i];
        colors.push(`rgb(${r}, ${g}, ${b})`);
      } else {
        // Generate variations for additional colors
        const baseIndex = i % baseColors.length;
        const [r, g, b] = baseColors[baseIndex];

        // Create variations by adjusting brightness and saturation
        const variation = Math.floor(i / baseColors.length);
        const brightnessFactor = 0.7 + variation * 0.1; // 0.7, 0.8, 0.9, 1.0, etc.
        const saturationShift = ((variation * 15) % 60) - 30; // shift hue slightly

        // Convert RGB to HSL, modify, then back to RGB
        const [h, s, l] = rgbToHsl(r, g, b);
        const newH = (h + saturationShift + 360) % 360;
        const newL = Math.min(Math.max(l * brightnessFactor, 0.1), 0.9);
        const [newR, newG, newB] = hslToRgb(newH, s, newL);

        colors.push(
          `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
        );
      }
    }
    return colors;
  };

  // Helper function to convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h * 360, s, l];
  };

  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      return [l * 255, l * 255, l * 255]; // achromatic
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);

    return [r * 255, g * 255, b * 255];
  };

  // Fetch data
  const fetchRoleWiseReport = async () => {
    setIsLoading(true);
    try {
      const selectedValues = filterDesignation.map((opt) => opt.value);
      const response = await getRoleWiseReport(selectedValues);
      if (response?.success && response?.data) {
        const keys = Object.keys(response.data);
        const values = Object.values(response.data) as number[];
        setLabels(keys);
        setDataValues(values);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleWiseReport();
  }, [filterDesignation]);

  // Highcharts options for Column chart with rotated labels
  // const options: Highcharts.Options = {
  //   chart: {
  //     type: "column",
  //     height: 500,
  //   },
  //   title: { text: undefined },
  //   xAxis: {
  //     categories: labels,
  //     labels: {
  //       style: { color: "#000" },
  //       rotation: -45,
  //       formatter: function () {
  //         const str = String(this.value);
  //         const maxWords = 1; // show only the first word
  //         const words = str.split(" ");
  //         if (words.length > maxWords) {
  //           return words.slice(0, maxWords).join(" ") + "...";
  //         }
  //         return str;
  //       },
  //     },
  //   },
  //   tooltip: {
  //     formatter: function () {
  //       const fullLabel = String(this.key);
  //       const capitalizedLabel =
  //         fullLabel.charAt(0).toUpperCase() + fullLabel.slice(1);
  //       return `<b>${capitalizedLabel}</b>: ${this.y} applicants`;
  //     },
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: { text: "Applicants" },
  //     labels: {
  //       style: { color: "#000" },
  //       formatter: function () {
  //         const value = String(this.value);
  //         return value.charAt(0).toUpperCase() + value.slice(1);
  //       },
  //     },
  //   },
  //   legend: { enabled: false },
  //   credits: { enabled: false },
  //   plotOptions: {
  //     column: {
  //       colorByPoint: true,
  //       colors: generateColors(dataValues.length),
  //       cursor: "pointer",
  //       pointWidth: 50, // Fixed width for columns
  //       maxPointWidth: 50, // Maximum width limit
  //       dataLabels: {
  //         enabled: true,
  //         format: "{y}",
  //         style: { fontWeight: "bold", color: "#000" },
  //       },
  //       point: {
  //         events: {
  //           click: function () {
  //             console.log("Clicked:", this.category);
  //           },
  //         },
  //       },
  //     } as Highcharts.PlotColumnOptions,
  //   },
  //   series: [
  //     {
  //       type: "column",
  //       name: "Applicants",
  //       data: dataValues,
  //     },
  //   ],
  // };

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 500,
    },
    title: { text: undefined },
    xAxis: {
      categories: labels,
      labels: {
        style: { color: "#000" },
        rotation: -45,
        formatter: function () {
          const str = String(this.value);
          const maxWords = 1; // show only the first word
          const words = str.split(" ");
          let firstWord = words.slice(0, maxWords).join(" ");
          // Capitalize first letter
          firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
          if (words.length > maxWords) {
            return firstWord + "...";
          }
          return firstWord;
        },
      },
    },
    tooltip: {
      formatter: function () {
        const fullLabel = String(this.key);
        const capitalizedLabel =
          fullLabel.charAt(0).toUpperCase() + fullLabel.slice(1);
        return `<b>${capitalizedLabel}</b>: ${this.y} applicants`;
      },
    },
    yAxis: {
      min: 0,
      title: { text: "Applicants" },
      labels: {
        style: { color: "#000" },
        formatter: function () {
          return String(this.value); // Remove capitalization for numeric values
        },
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        colors: generateColors(dataValues.length),
        cursor: "pointer",
        pointWidth: 50, // Fixed width for columns
        maxPointWidth: 50, // Maximum width limit
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: { fontWeight: "bold", color: "#000" },
        },
        point: {
          events: {
            click: function () {
              console.log("Clicked:", this.category);
            },
          },
        },
      } as Highcharts.PlotColumnOptions,
    },
    series: [
      {
        type: "column",
        name: "Applicants",
        data: dataValues,
      },
    ],
  };

  return (
    <div>
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #f0f0f0;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: gray;
            border-radius: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: black;
          }
        `}
      </style>

      {/* Multi-select filter */}
      <div className="justify-content-end mb-3 align-items-center d-flex ">
        <CheckboxMultiSelect
          name="selectedColumns"
          className="mb-2 select-border w-[350px]"
          placeholder="Designation"
          value={filterDesignation}
          isMulti={true}
          showSelectAll={false}
          onChange={(selected: SelectedOption[]) =>
            SetFilterDesignation(selected)
          }
          options={designationType}
        />
      </div>

      {/* Chart */}
      <div className="w-full min-h-[400px] flex justify-center items-center">
        {isLoading ? (
          <Skeleton height="500px" width="100%" />
        ) : (
          <div className="w-full overflow-x-auto custom-scroll">
            <div
              style={{ minWidth: `${Math.max(800, dataValues.length * 80)}px` }}
            >
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnChart;
