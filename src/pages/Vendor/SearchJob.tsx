import { Result } from "antd";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import { MultiSelect, BaseSelect } from "components/BaseComponents/BaseSelect";
import {
  City,
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import { capitalizeWords, errorHandle } from "utils/commonFunctions";
import { viewAllJobPublic } from "api/apiJob";
import { toast } from "react-toastify";
import { ViewAppliedSkills } from "api/skillsApi";
import { useNavigate } from "react-router-dom";
import { viewAllCity } from "api/cityApis";
import Offcanvas from "react-bootstrap/esm/Offcanvas";

const { SalaryFrequency, workPreferenceType } = appConstants;

const SearchJob = () => {
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => setShowFilter(!showFilter);

  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [filterExpectedPkg, setFilterExpectedPkg] = useState<number>(0);
  const [requiredSkills, setRequiredSkills] = useState<SelectedOption1[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [searchAll, setSearchAll] = useState<string>("");
  const [minExperience, setMinExperience] = useState<number[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterJobDescription, setFilterJobDescription] = useState<string>();
  const [filterJobSubject, setFilterJobSubject] = useState<string>();
  const [filterSalarayFreq, setFilterSalaryFreq] =
    useState<SelectedOption | null>(null);
  const [workPreference, setWorkPreference] = useState<SelectedOption | null>(
    null,
  );
  const [filterJobLocation, setFilterJobLocation] =
    useState<SelectedOption | null>(null);

  const fetchSkills = async () => {
    try {
      const response = await ViewAppliedSkills({
        page: 1,
        pageSize: 50,
        limit: 500,
      });

      const skillData = response?.data?.data || [];
      setSkillOptions(
        skillData.map((item: any) => ({
          label: item.skills,
          value: item._id,
        })),
      );
    } catch (error: any) {
      // Only show error toast if it's not a silent error
      const details = error?.response?.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        // Show only the first error to avoid multiple toasts
        toast.error(details[0]);
      } else if (error?.response?.status !== 404) {
        toast.error("Failed to fetch skills. Please try again.");
      }
    }
  };

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const getCities = async () => {
      try {
        const cityData = await viewAllCity();
        if (cityData?.data) {
          setCities(
            cityData.data.item.map(
              (city: { city_name: string; _id: string; state_id: string }) => ({
                label: city.city_name,
                value: city._id,
                state_id: city.state_id,
              }),
            ),
          );
        }
      } catch (error: any) {
        // Only show error if it's not a network error or 404
        if (error?.response?.status !== 404) {
          errorHandle(error);
        }
      }
    };

    getCities();
  }, []);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      limit: 50,
    };
    // Priority: searchAll > filterJobSubject > filterJobDescription
    if (searchAll) {
      params.search = searchAll;
    } else if (filterJobSubject) {
      params.search = filterJobSubject;
    } else if (filterJobDescription) {
      params.search = filterJobDescription;
    }
    if (filterSalarayFreq) params.salary_frequency = filterSalarayFreq.value;
    if (filterJobLocation) params.job_location = filterJobLocation.label;
    if (workPreference) params.work_preference = workPreference.value;
    if (requiredSkills.length > 0) {
      params.required_skills = requiredSkills
        .map((skill) => skill.label)
        .join(",");
    }
    if (minExperience) params.min_experience = String(minExperience);
    if (filterExpectedPkg) params.min_salary = filterExpectedPkg;

    viewAllJobPublic(params)
      .then((res) => {
        if (res?.success) {
          setFormData(res?.data?.item);
        }
      })
      .catch((error) => {
        // Only show error if it's not a network error or if it's a meaningful error
        if (error?.response?.status !== 404) {
          errorHandle(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchAll,
    filterJobDescription,
    filterJobSubject,
    filterSalarayFreq,
    requiredSkills,
    minExperience,
    workPreference,
    filterExpectedPkg,
    filterJobLocation,
  ]);

  const resetFilters = () => {
    setFilterJobDescription("");
    setFilterJobSubject("");
    setFilterSalaryFreq(null);
    setRequiredSkills([]);
    setMinExperience([]);
    setWorkPreference(null);
    setFilterExpectedPkg(0);
    setFilterJobLocation(null);
  };

  // const handleJobSubjectChange = (e: React.ChangeEvent<any>) => {
  //   setFilterJobDescription(e.target.value);
  // };
  const handleJobTitleChange = (e: React.ChangeEvent<any>) => {
    setFilterJobSubject(e.target.value);
  };
  const handleMinExperienceChange = (e: React.ChangeEvent<any>) => {
    setMinExperience(e.target.value as number[]);
  };
  const handleExpectedPkgChange = (e: React.ChangeEvent<any>) => {
    setFilterExpectedPkg(e.target.value);
  };

  const handleRequiredSkillsChange = (selectedOptions: SelectedOption1[]) => {
    setRequiredSkills(selectedOptions);
  };

  const handleLocationChange = (selectedOptions: SelectedOption) => {
    setFilterJobLocation(selectedOptions);
  };

  const handleSalaryFrequencyChange = (selectedOption: SelectedOption) => {
    setFilterSalaryFreq(selectedOption);
  };

  const handleWorkExp = (selectedOption: SelectedOption) => {
    setWorkPreference(selectedOption);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const handleNavigate = (jobId: string) => {
    navigate(`/Vendor/detailed-job/${jobId}`);
    handleSearchChange;
  };

  const drawerList = () => (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </h3>
      </div>

      {/* Filter Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4 max-h-[calc(100vh-200px)]">
        <div className="space-y-4">
          <div>
            <BaseInput
              name="job_subject"
              label="Job Title"
              value={filterJobSubject}
              placeholder="Enter job title"
              handleChange={handleJobTitleChange}
              type="text"
              className="mb-0"
            />
          </div>

          <div>
            <BaseSelect
              label="Location"
              name="job_location"
              className="select-border mb-0"
              placeholder="Select Location"
              value={filterJobLocation}
              handleChange={handleLocationChange}
              options={cities}
            />
          </div>

          <div>
            <MultiSelect
              label="Required Skills"
              name="required_skills"
              className="select-border mb-0"
              placeholder="Select skills"
              value={requiredSkills}
              isMulti
              onChange={handleRequiredSkillsChange}
              options={skillOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <BaseInput
                name="min_experience"
                label="Min Experience"
                value={minExperience}
                placeholder="Years"
                handleChange={handleMinExperienceChange}
                type="text"
                className="mb-0"
              />
            </div>
            <div>
              <BaseInput
                name="min_salary"
                label="Min Salary"
                value={filterExpectedPkg}
                placeholder="Amount"
                handleChange={handleExpectedPkgChange}
                type="text"
                className="mb-0"
              />
            </div>
          </div>

          <div>
            <BaseSelect
              label="Salary Frequency"
              name="salary_frequency"
              className="select-border mb-0"
              placeholder="Select frequency"
              value={filterSalarayFreq}
              handleChange={handleSalaryFrequencyChange}
              options={SalaryFrequency}
            />
          </div>

          <div>
            <BaseSelect
              label="Work Preference"
              name="work_preference"
              className="select-border mb-0"
              placeholder="Select preference"
              value={workPreference}
              handleChange={handleWorkExp}
              options={workPreferenceType}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-center">
        <BaseButton
          color="primary"
          className="w-full !flex items-center justify-center"
          onClick={resetFilters}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset Filters
        </BaseButton>
      </div>
    </div>
  );

  return (
    <Container fluid>
      <Row>
        <Col xs={12} className="pt-3">
          <BaseButton
            color="primary"
            className="mb-3 md:hidden"
            onClick={toggleFilter}
          >
            <i className="mx-1 fa fa-filter"></i> Filters
          </BaseButton>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="hidden md:block sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto pt-3"
        >
          {drawerList()}
        </Col>
        <Col xs={12} sm={12} md={8} lg={9} className="pt-3">
          {loading || !formData ? (
            <Skeleton count={5} />
          ) : (
            (() => {
              const activeJobs = formData?.filter(
                (item: any) => item?.isActive === true,
              );
              return activeJobs?.length > 0 ? (
                <div className="space-y-4">
                  {activeJobs.slice(0, 50).map((item: any) => (
                    <Card
                      key={item._id}
                      className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                      <CardBody className="p-0">
                        {/* Header Section */}
                        <div className="mb-2">
                          <h2
                            className="text-2xl font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors mb-1"
                            onClick={() => handleNavigate(item._id)}
                          >
                            {capitalizeWords(item.job_subject || "")}
                          </h2>
                          <div
                            className="ql-editor text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: item.sub_description,
                            }}
                          />
                        </div>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem] ">
                                Job Type
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.job_type || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-50">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem]">
                                Salary
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.min_salary && item.max_salary
                                  ? `${item.salary_currency || ""} ${
                                      item.min_salary
                                    } - ${item.max_salary}`
                                  : item.min_salary
                                    ? `${item.salary_currency || ""} ${
                                        item.min_salary
                                      }+`
                                    : "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem]">
                                Frequency
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.salary_frequency || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-50">
                              <svg
                                className="w-4 h-4 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem]">
                                Experience
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.min_experience
                                  ? `${item.min_experience} years`
                                  : "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-50">
                              <svg
                                className="w-4 h-4 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem]">
                                Location
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.job_location || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50">
                              <svg
                                className="w-4 h-4 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-[0.3rem]">
                                Deadline
                              </p>
                              <p className="text-sm font-semibold text-gray-800 mb-[0.3rem]">
                                {item.application_deadline &&
                                !isNaN(
                                  new Date(item.application_deadline).getTime(),
                                )
                                  ? new Date(
                                      item.application_deadline,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Required Skills */}
                        {item.required_skills &&
                          item.required_skills.length > 0 && (
                            <div className="mb-4 pb-4 border-b border-gray-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Required Skills:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.required_skills.map((skill: string) => (
                                  <span
                                    key={skill}
                                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Action Button */}
                        <div className="flex justify-end items-center">
                          <BaseButton
                            color="primary"
                            className="px-6 py-2 font-semibold !flex items-center justify-center"
                            onClick={() => handleNavigate(item._id)}
                          >
                            Apply Now
                            <svg
                              className="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </BaseButton>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Result title="No Jobs Found" />
              );
            })()
          )}
        </Col>
      </Row>
      <Offcanvas show={showFilter} onHide={toggleFilter} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{drawerList()}</Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default SearchJob;
