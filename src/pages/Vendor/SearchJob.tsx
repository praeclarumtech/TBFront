
import { List, Result, Tag } from "antd";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import { MultiSelect, BaseSelect } from "components/BaseComponents/BaseSelect";
import {
  City,
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import { errorHandle } from "utils/commonFunctions";
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
    null
  );
  const [filterJobLocation, setFilterJobLocation] =
    useState<SelectedOption | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
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
        }))
      );
    } catch (error: any) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details)) {
        details.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error("Failed to fetch skills.. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const getCities = async () => {
      try {
        setLoading(true);

        const cityData = await viewAllCity();
        if (cityData?.data) {
          setCities(
            cityData.data.item.map(
              (city: { city_name: string; _id: string; state_id: string }) => ({
                label: city.city_name,
                value: city._id,
                state_id: city.state_id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
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
    if (searchAll) params.search = searchAll;
    if (filterJobDescription) params.search = filterJobDescription;
    if (filterJobSubject) params.search = filterJobSubject;
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
        errorHandle(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    pagination.pageIndex,
    pagination.pageSize,
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
    <Card className="flex flex-col h-full p-0 border-0 max-h-[85vh] overflow-auto">
      <CardHeader className="bg-white border-0">
        <h3 className="static mt-3">Filters</h3>
      </CardHeader>

      <div className="flex-1 px-3 overflow-auto">
        <List className="space-y-2">
          <BaseInput
            name="job_subject"
            label="Job Title"
            value={filterJobSubject}
            placeholder="Job Title"
            handleChange={handleJobTitleChange}
            type="text"
          />
          {/* <BaseInput
            name="job_description"
            label="Job Description"
            value={filterJobDescription}
            placeholder="Job Description"
            handleChange={handleJobSubjectChange}
            type="text"
          /> */}
          <BaseSelect
            label="Salary Frequency"
            name="salary_frequency"
            className="select-border"
            placeholder="Salary Frequency"
            value={filterSalarayFreq}
            handleChange={handleSalaryFrequencyChange}
            options={SalaryFrequency}
          />
          <MultiSelect
            label="Required Skills"
            name="required_skills"
            className="select-border"
            placeholder="Required Skills"
            value={requiredSkills}
            isMulti
            onChange={handleRequiredSkillsChange}
            options={skillOptions}
          />
          <BaseSelect
            label="Location"
            name="job_location"
            className="select-border"
            placeholder="Select Location"
            value={filterJobLocation}
            handleChange={handleLocationChange}
            options={cities}
          />
          <BaseInput
            name="min_experience"
            label="Min Experience"
            value={minExperience}
            placeholder="Min Experience"
            handleChange={handleMinExperienceChange}
            type="text"
          />
          <BaseSelect
            label="Work Preference"
            name="work_preference"
            className="select-border"
            placeholder="Work Preference"
            value={workPreference}
            handleChange={handleWorkExp}
            options={workPreferenceType}
          />
          <BaseInput
            name="min_salary"
            label="Min Salary"
            value={filterExpectedPkg}
            placeholder="Min Salary"
            handleChange={handleExpectedPkgChange}
            type="text"
            className="mb-2"
          />
        </List>
      </div>
      <CardFooter className="bg-white border-0 ">
        <div className="sticky text-end">
          <BaseButton
            color="primary"
            sx={{ width: "auto" }}
            onClick={resetFilters}
          >
            Reset Filters
          </BaseButton>
        </div>
      </CardFooter>
    </Card>
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
            Filters
          </BaseButton>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="hidden md:block sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto pt-3"
        >
          {/* <div className="static max-h-screen "> */}
          <div className="bg-white rounded shadow">{drawerList()}</div>
          {/* </div> */}
        </Col>

        <Col xs={12} sm={6} md={8} lg={9} className="pt-3">
          {loading ? (
            <Skeleton count={5} />
          ) : formData?.length > 0 ? (
            <div className="space-y-4">
              {formData.slice(0, 50).map((item: any) => (
                <Card
                  key={item._id}
                  className="p-4 border border-gray-200 rounded-md shadow"
                >
                  <CardBody>
                    <h2
                      className="text-xl text-blue-600 underline cursor-pointer truncated-text hover:text-blue-800"
                      onClick={() => handleNavigate(item._id)}
                    >
                      {item.job_subject}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{
                          __html: item.sub_description,
                        }}
                      />
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3 text-sm">
                      <Tag color="geekblue">Job Type: {item.job_type}</Tag>
                      <Tag color="geekblue">
                        Currency: {item.salary_currency}
                      </Tag>
                      <Tag color="geekblue">
                        Payment: {item.salary_frequency}
                      </Tag>
                      <Tag color="geekblue">Max Salary: {item.max_salary}</Tag>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 text-sm">
                      <Tag color="geekblue">
                        Min Experience: {item.min_experience} years
                      </Tag>
                      <Tag color="geekblue">Location: {item.job_location}</Tag>
                      <Tag color="geekblue">
                        Deadline:{" "}
                        {item.application_deadline &&
                        !isNaN(new Date(item.application_deadline).getTime())
                          ? new Date(item.application_deadline)
                              .toISOString()
                              .slice(0, 10)
                          : "N/A"}
                      </Tag>
                    </div>

                    <div className="mt-2">
                      <span className="font-medium text-success">
                        Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.required_skills?.map((skill: string) => (
                          <Tag key={skill} color="green">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <BaseButton
                        color="primary"
                        onClick={() => handleNavigate(item._id)}
                      >
                        Apply Now
                      </BaseButton>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Result title="No Job Data Found" />
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
