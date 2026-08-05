import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Public Pages
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Services from '@/pages/public/Services';
import ServiceDetail from '@/pages/public/ServiceDetail';
import Portfolio from '@/pages/public/Portfolio';
import ProjectDetail from '@/pages/public/ProjectDetail';
import Tutorials from '@/pages/public/Tutorials';
import TutorialDetail from '@/pages/public/TutorialDetail';
import Blog from '@/pages/public/Blog';
import BlogPost from '@/pages/public/BlogPost';
import Careers from '@/pages/public/Careers';
import Reviews from '@/pages/public/Reviews';
import Contact from '@/pages/public/Contact';
import Support from '@/pages/public/Support';
import Privacy from '@/pages/public/Privacy';
import Terms from '@/pages/public/Terms';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/ServicesManage';
import AdminPortfolio from '@/pages/admin/PortfolioManage';
import AdminTutorials from '@/pages/admin/TutorialsManage';
import AdminBlog from '@/pages/admin/BlogManage';
import AdminReviews from '@/pages/admin/ReviewsManage';
import AdminMessages from '@/pages/admin/MessagesManage';
import AdminQuotes from '@/pages/admin/QuotesManage';
import AdminNewsletter from '@/pages/admin/NewsletterManage';
import AdminTeam from '@/pages/admin/TeamManage';
import AdminFaq from '@/pages/admin/FaqManage';
import AdminJobs from '@/pages/admin/JobsManage';
import AdminSettings from '@/pages/admin/SettingsManage';
import AdminUpdates from '@/pages/admin/UpdatesManage';
import Updates from '@/pages/public/Updates';
import UpdatePost from '@/pages/public/UpdatePost';

import NotFound from '@/pages/not-found';
import { ThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/services/:id" component={ServiceDetail} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/portfolio/:id" component={ProjectDetail} />
        <Route path="/tutorials" component={Tutorials} />
        <Route path="/tutorials/:id" component={TutorialDetail} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/updates" component={Updates} />
        <Route path="/updates/:id" component={UpdatePost} />
        <Route path="/careers" component={Careers} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/contact" component={Contact} />
        <Route path="/support" component={Support} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/portfolio" component={AdminPortfolio} />
        <Route path="/admin/tutorials" component={AdminTutorials} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/reviews" component={AdminReviews} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/quotes" component={AdminQuotes} />
        <Route path="/admin/newsletter" component={AdminNewsletter} />
        <Route path="/admin/team" component={AdminTeam} />
        <Route path="/admin/faq" component={AdminFaq} />
        <Route path="/admin/jobs" component={AdminJobs} />
        <Route path="/admin/updates" component={AdminUpdates} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/*" component={AdminRoutes} />
      <Route path="/admin" component={AdminRoutes} />
      <Route path="/*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
