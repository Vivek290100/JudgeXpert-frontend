import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => (
  <div style={{ padding: "20px" }}>
    {/* Header or Title for Public, User, or Admin Pages */}
    <Skeleton height={50} width={300} style={{ marginBottom: "15px" }} />
    
    {/* Content for different sections */}
    <Skeleton count={3} height={20} style={{ marginBottom: "10px" }} />
    <Skeleton height={300} /> {/* Main content area */}
    
    {/* Button or Footer element */}
    <Skeleton height={40} width={150} style={{ marginTop: "20px" }} />
  </div>
);

export default SkeletonLoader;