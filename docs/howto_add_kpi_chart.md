# How To Add KPI Chart

We recommend Visual Studio Code for development as it provides IDE-level support for Typescript showing errors for typing and inheritance even before compilation.

## 1. Create KPI Mapper

Create a new class extending from the base class (i.e. KpiMapper). Samples are provided within the kpimappers folder. **Filenames must end with "KpiMapper" or the chart will not detect it.**

* **User_Stories/A_StoryPointsVelocityKpiMapper** shows a simple kpi mapper that is easy to duplicate, also shows how missing data are zeroed out
* **User_Stories/B_StoryPointsVsBugsResolveKpiMapper** shows a more complex kpi mapper with two y-axis, missing data are zeroed out
* **Defects/D_DaysToResolutionKpiMapper** shows multiple lines kpi mapper, missing data are ignored (not plotted)
* **BuildSuccessRateSegmentKpiMapper** shows a complex kpi mapper base class that is used in all the build success rate kpi mappers, missing data are ignored

## 2. Use config/config.kpi.js for target and stretch goals

So it's easier to change goals in the future.

## 3. Rebuild the back-end

* npm run build-back
* npm run start