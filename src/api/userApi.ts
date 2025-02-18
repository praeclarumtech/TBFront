// src/components/FeedbackModal.tsx
import  { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
// import { Applicant } from '../../types';
import { updateApplicant } from '../../services/applicantService';
// import node module libraries
import { Badge } from "react-bootstrap";
// src/components/Form/SelectInput.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
// src/components/Form/TextInput.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-bootstrap';
//import node module libraries
import { useContext } from "react";
import { useAccordionButton, AccordionContext } from "react-bootstrap";
import { Link } from "react-router-dom";
//import node module libraries
import { useContext } from "react";
import { AccordionContext, useAccordionButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fragment, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ListGroup, Card, Image, Badge } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { CustomToggle } from "./CustomToggle";
import { CustomToggleLevelTwo } from "./CustomToggleLevelTwo";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationProps } from "types";
import { NotificationList } from "./NotificationList";
// import Settings from "../../../pages/dashboard/pages/Settings";
import { useNavigate } from "react-router-dom";
// import node module libraries
import { Menu } from "react-feather";
import { Link } from "react-router-dom";
import { Nav, Navbar, Form } from "react-bootstrap";

// import sub components
import Notifications from "./Notifications";
import { Link, useNavigate } from "react-router-dom";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { NotificationList } from "./NotificationList";
import { NotificationProps } from "types";
import SimpleBar from "simplebar-react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
// import "simplebar/dist/simplebar.min.css";
import { NotificationProps } from "types";

// import node module libraries
import { Fragment } from "react";
import { useMediaQuery } from "react-responsive";

import React from 'react'
import PersonalDetailsForm from './PersonalDetailsForm'
import EducationalDetailsForm from './EducationSkillsForm'
import JobDetailsForm from './JobDetailsForm'
import { Button } from '@mui/material';



import { useForm } from 'react-hook-form';
import { Button, FormHelperText } from '@mui/material';
import { educationalDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import { Select, MenuItem, FormControl, Checkbox, ListItemText } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';


import StepperForm from "./StepperForm.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from "react-bootstrap";



// src/components/StepperForm/JobDetailsForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { jobDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import { Select, MenuItem, FormControl } from '@mui/material';
import { TextField, FormHelperText } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { personalDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// src/components/StepperForm/PreviewForm.tsx
import React from 'react';
import { Button, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
// import { useNavigate, Navigate } from 'react-router';
// import { useNavigate } from 'react-router';
// import EditApplicant from './EditApplicant';

// src/components/StepperForm/StepperForm.tsx
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import PersonalDetailsForm from './PersonalDetailsForm';
import EducationalDetailsForm from './EducationSkillsForm';
import JobDetailsForm from './JobDetailsForm';
import PreviewForm from './PreviewForm';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
// import Applicant from "../../components/StepperForm/index"

// src/components/Form/ActionButton.tsx
import React from 'react';
import { Button } from '@mui/material';
// src/components/Dropdown.tsx
import React, { ReactNode } from 'react';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-bootstrap';
// src/components/FormButton.tsx
import React from 'react';
import { Button } from '@mui/material';

import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
// src/components/Form/InputField.tsx
import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
/ src/components/Form/SelectField.tsx
import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ActiveProjectsDataProps } from "types";

import { Briefcase, ListTask, People, Bullseye } from "react-bootstrap-icons";
import { ProjectsStatsProps } from "types";
import { TeamsDataProps } from "types";

import { v4 as uuid } from "uuid";
import { NotificationProps } from "types";
//import node module libraries
import { Outlet } from "react-router";
import { Container } from "react-bootstrap";
// import { Link } from "react-router-dom";
//import node module libraries
import { Outlet } from "react-router";
// import { Link } from "react-router-dom";
import Sidebar from "components/navbars/sidebar/Sidebar";
import Header from "components/navbars/topbar/Header";
// import { Image } from "react-bootstrap";
import { useState } from "react";

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import custom hook
import { useMounted } from "hooks/useMounted";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//import custom hook
import { useMounted } from "hooks/useMounted";

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//import custom hook
import { useMounted } from "hooks/useMounted";

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//import custom hook
import { useMounted } from "hooks/useMounted";

// import node module libraries
import { Row, Col, Container } from "react-bootstrap";

// import widget as custom components
import { PageHeading } from "widgets";

// import node module libraries
import { Fragment } from "react";
// import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
//import node module libraries
import { Link } from "react-router-dom";
import { Col, Row, Container, Image } from "react-bootstrap";


import { useState, useEffect } from "react";
import { Table, Form, Container, Row, Col, Card, InputGroup, Dropdown, Pagination } from "react-bootstrap";
import { Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { Button, Typography } from '@mui/material';
import UpdateModal from "./EditApplicantModal";
import { useNavigate } from "react-router-dom";
import ViewModal from "./ViewModal";
import { Applicant } from "../../types";
// import {
//   fetchApplicants,
//   deleteApplicant,
//   viewApplicant,
//   updateApplicantStatus,
//   updateApplicantInterviewStage,
// } from "../../api/applicantApi";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetailsForm from "../../components/StepperForm/PersonalDetailsForm";
import EducationalDetailsForm from "../../components/StepperForm/EducationSkillsForm";
import JobDetailsForm from "../../components/StepperForm/JobDetailsForm";
import { Button } from "@mui/material";
import { Applicant } from "../../types";

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetailsForm from "../../components/StepperForm/PersonalDetailsForm";
import EducationalDetailsForm from "../../components/StepperForm/EducationSkillsForm";
import JobDetailsForm from "../../components/StepperForm/JobDetailsForm";
import { Button } from "@mui/material";
import { Applicant } from "../../types";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";


import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import { Applicant } from "../../types";

import { DashboardMenuProps } from "types";
import { v4 as uuid } from "uuid";

import { useState, useEffect } from "react";
import { Table, Form, Container, Row, Col, Card, InputGroup, Dropdown, Pagination } from "react-bootstrap";
import { Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { Button, Typography } from '@mui/material';
import UpdateModal from "./EditApplicantModal";
import { useNavigate } from "react-router-dom";
import ViewModal from "./ViewModal";
import { Applicant } from "../../types";

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetailsForm from "../../components/StepperForm/PersonalDetailsForm";
import EducationalDetailsForm from "../../components/StepperForm/EducationSkillsForm";
import JobDetailsForm from "../../components/StepperForm/JobDetailsForm";
import { Button } from "@mui/material";
import { Applicant } from "../../types";
// import node module libraries
import { Col, Row, Form, Card, Button, Image } from "react-bootstrap";

// import widget as custom components
import { FormSelect } from "widgets";

// import hooks
import { useMounted } from "hooks/useMounted";

