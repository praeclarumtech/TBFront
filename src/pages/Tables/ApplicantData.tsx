// import node module libraries
import { Link } from "react-router-dom";
import { ProgressBar, Col, Row, Card, Table, Image } from "react-bootstrap";
import { Form } from "react-bootstrap";
// import required data files
import ActiveProjectsData from "data/dashboard/ActiveProjectsData";
import { ActiveProjectsDataProps } from "types";

const ApplicantData = () => {
    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white py-4">
                        <Row>
                            <Col md={8} xs={12}>
                            <div>
                                <h4 className="mb-0"> Applicants</h4>

                            </div>
                        </Col>
                        <Col md={4} xs={12}>
                        <div className="ms-lg-3 d-none d-md-none d-lg-block">
                            {/* Search Form */}
                            <Form className="d-flex align-items-right ">
                                <Form.Control className="" type="search" placeholder="Search" />
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Card.Header>

            <Table responsive className="text-nowrap mb-0">

                <thead className="table-light">
                    <tr>
                        <th>Sno.</th>
                        <th>Applicant Name</th>
                        <th>Technology</th>
                        <th>Operation</th>
                        <th>Comments</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {ActiveProjectsData.map((item: ActiveProjectsDataProps) => {
                        return (
                            <tr key={item.id}>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center">
                                    {item.hours}
                                        {/* <div>
                                            <div
                                                className={`icon-shape icon-md border p-4 rounded-1 ${item.brandLogoBg}`}
                                            >
                                                <Image src={item.brandLogo} alt="" />
                                            </div>
                                        </div> */}
                                        {/* <div className="ms-3 lh-1">
                                            <h5 className=" mb-1">
                                                <Link to="#" className="text-inherit">
                                                    {item.projectName}
                                                </Link>
                                            </h5>
                                        </div> */}
                                    </div>
                                </td>
                                <td className="align-middle">{item.hours}</td>
                                <td className="align-middle">
                                    <span className={`badge bg-${item.priorityBadgeBg}`}>
                                        {item.priority}
                                    </span>
                                </td>
                                <td className="align-middle">
                                    <div className="avatar-group">
                                        {item.members.map((avatar, avatarIndex) => {
                                            return (
                                                <span
                                                    className="avatar avatar-sm"
                                                    key={avatarIndex}
                                                >
                                                    <Image
                                                        alt="avatar"
                                                        src={avatar.image}
                                                        className="rounded-circle"
                                                    />
                                                </span>
                                            );
                                        })}
                                        <span className="avatar avatar-sm avatar-primary">
                                            <span className="avatar-initials rounded-circle fs-6">
                                                +5
                                            </span>
                                        </span>
                                    </div>
                                </td>
                                <td className="align-middle text-dark">
                                    <div className="float-start me-3">{item.progress}%</div>
                                    <div className="mt-2">
                                        <ProgressBar
                                            now={item.progress}
                                            style={{ height: "5px" }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Card.Footer className="bg-white text-center">
                <Link to="#" className="link-primary">
                    View All Projects
                </Link>
            </Card.Footer>
        </Card>
        </Col >
        </Row >
    );
};

export default ApplicantData;
