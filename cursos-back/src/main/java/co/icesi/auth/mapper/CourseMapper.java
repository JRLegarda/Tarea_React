package co.icesi.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import co.icesi.auth.dtos.courses.CourseDTO;
import co.icesi.auth.dtos.courses.CourseDetailDTO;
import co.icesi.auth.model.Course;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface CourseMapper {

    @Mapping(source = "teacher.id", target = "teacherId")
    CourseDTO courseToCourseDTO(Course course);

    @Mapping(source = "students", target = "students", qualifiedByName = "userToString")
    CourseDetailDTO courseToDetailDTO(Course course);

    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "activities", ignore = true)
    Course courseDTOToCourse(CourseDTO courseDTO);
}
